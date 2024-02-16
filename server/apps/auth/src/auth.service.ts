import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcryptjs';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import {
  AddRoleDto,
  CreateUserDto,
  OutputJwtTokens,
  Role,
  TokenResponseDto,
  User,
} from '@app/models';
import { RolesService } from './roles/roles.service';
import { ConfigService } from '@nestjs/config';
import { ResidencyService } from './residency/residency.service';
import { VkLoginSdkDto } from '@app/models/dtos/vk-login-sdk.dto';
import { OutputUserAndTokens } from '@app/models/dtos/output-user-and-tokens.dto';
import { TokensService } from './tokens/tokens.service';
import { CreateResidencyDto } from '@app/models/dtos/create-residency.dto';
import { CreateRegistrationDto } from '@app/models/dtos/create-registration.dto';
import { LogoutUserDto } from '@app/models/dtos/logout-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly roleService: RolesService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly residencyService: ResidencyService,
    private readonly tokenService: TokensService,

  ) {}

  /**
   * Создание пользователя с правами администратора.
   * @param {CreateUserDto} dto - DTO для создания пользователя.
   * @returns TokenResponseDto - JWT токен. 
   */
  // async createSuperUser(dto: CreateUserDto): Promise<OutputJwtTokens> {
  //   const candidate = await this.userService.getUserByUserId(dto.user_id);

  //   if (candidate) {
  //     throw new RpcException(
  //       new BadRequestException(
  //         'Пользователь с такой электронной почтой уже существует',
  //       ),
  //     );
  //   }

    // const hashPassword = await bcrypt.hash(dto.password, 5);
    // const user = await this.userService.createAdmin({
    //   email: dto.user_id,
    //   // password: hashPassword,
    // });
    // const tokens = await this.generateTokens(user);
    // const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 5);
    // await this.userService.updateRefreshToken(user.id, hashRefreshToken);

    // return tokens;
    // return await this.generateToken(user);
  // }

  /**
   * Авторизация пользователя.
   * @param {CreateRoleDto} dto - DTO для создания пользователя.
   * @returns TokenResponseDto - JWT токен.
   */
  // async login(dto: CreateUserDto): Promise<OutputJwtTokens> {
  //   const user = await this.validateUser(dto.user_id);
  //   const tokens = await this.generateTokens(user);
  //   const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 5);
  //   await this.userService.updateRefreshToken(user.id, hashRefreshToken);
  //   return tokens;
  // }

  /**
   * Auth через vk
   */
  async vkLogin(query: VkLoginSdkDto): Promise<User> {

    if (query.uuid && query.token) {

      const dto = {
        uuid: query.uuid,
        token: query.token,
      }

      const candidate = await this.getOrCreateUser(dto)

      if (!candidate) {
        throw new RpcException(
          new UnauthorizedException('Во время авторизации произошла ошибка.')
          );
      }

      return candidate
    }

    throw new RpcException(
      new UnauthorizedException('Во время авторизации произошла ошибка.'),
    );
  }

  /**
   * Внесение в базу данных информации о регистрации
   */
  async setRegistration(dto: CreateRegistrationDto): Promise<OutputUserAndTokens> {

    const candidate = await this.userService.getUser(dto.id)

    if (!candidate) {
      throw new RpcException(
        new UnauthorizedException('Данный пользователь не существует.')
        );
    }

    if (dto.secret !== candidate.secret) {
      throw new RpcException(
        new ForbiddenException('Нет доступа')
        );
    }

      if (!candidate.isRegistration) { // Если пользователь не зарегистрирован
        candidate.isRegistration = true;
        await candidate.save()
      }

      return await this.login(candidate, dto.uuid)
  }

  /**
   * Auth через vk
   */
  private async login(candidate: User, uuid: string): Promise<OutputUserAndTokens> {

    const tokens = await this.generateTokens(candidate) // Создаем пару токен и рефреш токен
    const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 5) // Хешируем рефреш токен

    // Проверяем, есть ли токен для устройства с указанным uuid в базе данных 
    const tokenFromDataBase = await this.tokenService.getRefreshToken(uuid)

    if(!tokenFromDataBase) {
      const newRefreshToken = await this.tokenService.createRefreshToken({uuid, refreshToken: hashRefreshToken})
      await candidate.$add('tokens', [newRefreshToken.id])
      candidate.tokens = [newRefreshToken]
      await candidate.save()
    } else {
      const updateRefreshToken = await this.tokenService.updateRefreshToken({uuid, refreshToken: hashRefreshToken})
    }
    return {user: candidate, secret: candidate.secret, ...tokens}
  }



  /**
   * Регистрация нового пользователя.
   * @param {VkLoginSdkDto} dto - DTO для создания пользователя.
   * @returns User - данные пользователя.
   */
  async getOrCreateUser(dto: VkLoginSdkDto): Promise<User> {

    const DATA = {
      v: this.configService.get<string>('VK_VERSION'),
      token: dto.token,
      access_token: this.configService.get<string>('VK_SERVICE_SECRET'),
      uuid: dto.uuid
    }

    let response = await fetch('https://api.vk.com/method/auth.exchangeSilentAuthToken', {
            method:"POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
            body: `v=${DATA.v}&token=${DATA.token}&access_token=${DATA.access_token}&uuid=${DATA.uuid}`
        })

    if(response.ok) {
      let result = await response.json()
      if (result.response) {
        const arrayUsersFromVk = await this.getDataUser(result.response.access_token, result.response.user_id)
        const userVk = arrayUsersFromVk.response[0]

        const candidate = await this.userService.getUserByVkId(userVk.id) // Проверяем, есть ли пользователь с данным ID в базе данных

        if (candidate) return candidate

        const newUser = await this.userService.createUser({
        vk_id: userVk.id,
        first_name: userVk.first_name,
        last_name: userVk.last_name,
        photo_50: userVk.photo_50,
        photo_max: userVk.photo_max,
        secret: dto.uuid
        });

        return newUser
      }
    }

    return
  }

  /**
   * Получение данных пользователя.
   * @param {CreateUserDto} dto - DTO для создания пользователя.
   * @returns User - Проверенный пользователь.
   */
  private async getDataUser(access_token: string, id: string): Promise<any> {

    try {

      if (access_token && id) {        
    
        let params = {
          v: this.configService.get<string>('VK_VERSION'),
          user_ids: id,
          fields: 'photo_50,photo_max,first_name,last_name',
          access_token: access_token
      }
    
        const response = await fetch(`https://api.vk.com/method/users.get?${new URLSearchParams(params).toString()}`, {
                  method:"GET",
                  headers: {
                      'Content-Type': 'application/json',
                    },
        });

          // Преобразуем полученный ответ в JSON. 
          return response.json();
      } 
    } catch {
      throw new BadRequestException('Ошибка при получении данных пользователя');
    }
  }

  /**
   * Валидация пользователя.
   * @param {CreateUserDto} dto - DTO для создания пользователя.
   * @returns User - Проверенный пользователь.
   */
  // private async validateUser(dto: CreateUserDto): Promise<User> {
  //   const user = await this.userService.getUserByUserId(dto.user_id);

  //   if (!user) {
  //     throw new RpcException(
  //       new BadRequestException('Неккоректные электронная почта или пароль'),
  //     );
  //   }

  //   // const passwordEquals = await bcrypt.compare(dto.password, user.password);
  //   const passwordEquals = await bcrypt.compare(dto.password);

  //   if (user && passwordEquals) {
  //     return user;
  //   }

  //   throw new RpcException(
  //     new BadRequestException('Неккоректные электронная почта или пароль'),
  //   );
  // }

  /**
   * Генерация JWT токена.
   * @param {User} user - Пользователь.
   */
  private async generateToken(user: User): Promise<TokenResponseDto> {
    const payload = {
      id: user.id,
      // email: user.email,
      roles: user.roles,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  /**
   * Генерация JWT токенов.
   * @param {User} user - Пользователь.
   */
  private async generateTokens(user: User): Promise<OutputJwtTokens> {
    const payload = {
      id: user.id,
      roles: user.roles,
    };
    const accessSettings = {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    };
    const refreshSettings = {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '30d',
    };
    const token = await this.jwtService.signAsync(payload, accessSettings);
    const refreshToken = await this.jwtService.signAsync(
      payload,
      refreshSettings,
    );
    return {
      token,
      refreshToken,
    };
  }

  async updateTokens(uuid: string, refreshToken: string): Promise<OutputUserAndTokens> {
    const token = await this.tokenService.getRefreshToken(uuid)
    const user = await this.userService.getUser(token.userId)
    

    if (!user || !token) {
      throw new RpcException(new ForbiddenException('Доступ запрещен'));
    }

    const refreshTokenEquals = await bcrypt.compare(
      refreshToken,
      token.refreshToken,
    );

    if (!refreshTokenEquals) {
      throw new RpcException(new ForbiddenException('Доступ запрещен'))
    }

    const tokens = await this.generateTokens(user)
    const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 5)
    const refreshTokenDb = await this.tokenService.updateRefreshToken({uuid: uuid, refreshToken: hashRefreshToken})
    return {user, ...tokens}
  }

  /**
   * Обработчик верификации токена.
   */
  async handleValidateUser(data: any): Promise<Boolean> {
    return await this.jwtService.verify(data.token);
  }

  async handleValidateRefreshToken(refreshToken: string): Promise<Boolean> {
    return  await this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  /**
   * Обработчик верификации токена.
   */
  async handleValidateUserWithRoles(data: any): Promise<Boolean> {
    const checkToken = await this.jwtService.verifyAsync(data.token);
    const checkRoles = await checkToken.roles.some((role: any) =>
      data.requiredRoles.includes(role.value),
    );

    if (checkToken && checkRoles) {
      return checkToken;
    }

    throw new RpcException(new ForbiddenException('Нет доступа'));
  }

  /**
   * Получить пользователя. 
   * @param {number} id - Идентификатор пользователя.
   * @returns User - Найденный пользователь.
   */
  async getUser(id: number) {
    const user = await this.userService.getUser(id);

    if (!user) {
      throw new RpcException(new NotFoundException('Пользователь не найден'));
    }

    return user;
  }

  /**
   * Генерация пароля.
   * @param {number} len - Размер пароля.
   */
  gen_password(len: number) {
    let password = '';
    const symbols =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!№;%:?*()_+=';

    for (var i = 0; i < len; i++) {
      password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }

    return password;
  }

  // /**
  //  * Валидация токена.
  //  * @param {string} token - JWT токен.
  //  */
  // async validateVkToken(token: string) {
  //   const url = `https://api.vk.com/method/users.get?access_token=${token}&v=5.131`;
  //   const req = await lastValueFrom(this.httpService.get(url));
  //   if (req.data.error) {
  //       // throw new RpcException(new BadRequestException(`${JSON.stringify(req.data.error)}`))
  //       throw new RpcException(new BadRequestException(req.data.error.error_msg))
  //   }
  //   const tokenData = req.data.response[0];

  //   if (tokenData.id) {
  //     return true;
  //   }

  //   return false;
  // }

  /**
   * Проверка электронной почты.
   * @param {string} email - Электронная почта.
   */
  // async checkUserEmail(email: number) {
  //   const user = await this.userService.getUserByEmail(email);

  //   if (user) {
  //     throw new RpcException(
  //       new BadRequestException('Электронная почта уже занята'),
  //     );
  //   }

  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Электронная почта свободна',
  //   };
  // }

  /**
   * Добавить роль пользователю.
   * @param {AddRoleDto} dto - DTO для добавления роли пользоветилю.
   */
  async userAddRole(dto: AddRoleDto): Promise<AddRoleDto> {
    return await this.userService.addROle(dto);
  }

  /**
   * Удалить роль пользователю.
   * @param {AddRoleDto} dto - DTO для добавления роли пользоветилю.
   */
  async userRemoveRole(dto: AddRoleDto): Promise<AddRoleDto> {
    return await this.userService.removeRole(dto);
  }

  /**
   * Получить список всех ролей.
   * @returns Role[] - Список найденных ролей.
   */
  async getAllRoles(): Promise<Role[]> {
    return await this.roleService.getAllRoles();
  }

  /**
   * Разлогинить пользователя.
   * @param {number} user_id - Идентификатор пользователя.
   */
  async logout(dto: LogoutUserDto): Promise<any> {
    return await this.tokenService.removeRefreshToken(dto);
  }

  /**
   * Сохранить место жительства.
   * @param {CreateLocationDto} dto - DTO для добавления роли пользоветилю.
   */
   async createResidency(dto: CreateResidencyDto): Promise<CreateUserDto> {

    const user = await this.userService.getUser(dto.id)

    if (dto.secret !== user.secret) {
      throw new RpcException(new ForbiddenException('Нет доступа'));
    }

    const residency = await this.residencyService.createResidency(dto)
    const residencyFromId = await this.residencyService.getResidency(residency.id)
    await residencyFromId.$set('users', [dto.id]);
    await residencyFromId.save()

    return user


    // console.log(residencyFromId.updatedAt, 'updatedAt')
    // const date = residencyFromId.updatedAt
    // date.setMonth(date.getMonth() + 3)
    // console.log(date, 'date')
    // if (new Date() > date) {
    //   await residencyFromId.$set('user', [dto.id]);
    //   await residencyFromId.save()

    //   const user = await this.userService.getUser(dto.id)

    //   return user
    // }
  
    // throw new RpcException(new NotFoundException(`Вы не можете сменить место жительства до ${date}`))
  }
}
