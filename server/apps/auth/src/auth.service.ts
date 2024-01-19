import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcryptjs';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Payload, RpcException } from '@nestjs/microservices';
import {
  AddRoleDto,
  CreateUserDto,
  OutputJwtTokens,
  Role,
  TokenResponseDto,
  User,
  // VkLoginDto,
} from '@app/models';
import { RolesService } from './roles/roles.service';
import { ConfigService } from '@nestjs/config';
import { LocationService } from './location/location.service';
import { LocationUser } from '@app/models/models/users/location.model';
import { CreateLocationDto } from '@app/models/dtos/create-location.dto';
import { VkLoginSdkDto } from '@app/models/dtos/vk-login-sdk.dto';
// import { VkLoginTokenSdkDto } from '@app/models/dtos/vk-login-token-sdk.dto';
import { UsersController } from './users/users.controller';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly roleService: RolesService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly locationService: LocationService
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
   * Регистрация нового пользователя.
   * @param {VkLoginSdkDto} dto - DTO для создания пользователя.
   * @returns TokenResponseDto - JWT токен.
   */
   async registrationVk(dto: VkLoginSdkDto): Promise<OutputJwtTokens> {
  // async registrationVk(dto: CreateUserDto): Promise<OutputJwtTokens> {
    console.log(dto, 'dto registrationVk')
    const candidate = await this.userService.getUserByUserId(dto.user.id, false);

    if (candidate) {
      console.log('candidat')
      throw new RpcException('Вам нужно пройти регистрацию')
    }

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
        if (result) {
          if (result.response) {
            console.log(result.response)
            const arrayUsersFromVk = await this.getDataUser(result.response.access_token, result.response.user_id)
            const userVk = arrayUsersFromVk.response[0]

            console.log(userVk, 'userVk')

            const user = await this.userService.createUser({
            vk_id: userVk.id,
            first_name: userVk.first_name,
            last_name: userVk.last_name,
            photo_50: userVk.photo_50,
            photo_max: userVk.photo_max,
            });
            const tokens = await this.generateTokens(user);
            const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 5);
            await this.userService.updateRefreshToken(user.id, hashRefreshToken);

            return tokens;

            // return userVk
          }
          throw new RpcException('Нет результата.');
          
        } else {
            throw new RpcException('Ошибка при регистрации. Повторите попытку позже.');
        }
    } else {
        throw new BadRequestException('Ошибка при получении access token'); 
    }



    // const hashPassword = await bcrypt.hash(dto.password, 5);
    // const user = await this.userService.createUser({
      // email: dto.user_id,
      // password: hashPassword,
    // });
    // const tokens = await this.generateTokens(user);
    // const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 5);
    // await this.userService.updateRefreshToken(user.id, hashRefreshToken);

    // return tokens;
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

    

    // if(response.ok) { 
    //     let result = await response.json()
    //     if (result) {
    //         console.log(result)
    //         let user = await this.getDataUser(result.access_token, dto)
    //     } else {
    //         throw new UnauthorizedException();
    //     }
    // } else {
    //     throw new BadRequestException('Ошибка при получении access token');
    // }
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
      // email: user.email,
      roles: user.roles,
    };
    const accessSettings = {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    };
    const refreshSettings = {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
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

  async updateTokens(
    user_id: number,
    refreshToken: string,
  ): Promise<OutputJwtTokens> {
    const user = await this.getUser(user_id);
    const userRefreshToken: string = user.refreshToken;

    if (!user || !userRefreshToken) {
      throw new RpcException(new ForbiddenException('Доступ запрещен'));
    }

    const refreshTokenEquals = await bcrypt.compare(
      refreshToken,
      userRefreshToken,
    );

    if (!refreshTokenEquals) {
      throw new RpcException(new ForbiddenException('Доступ запрещен'));
    }

    const tokens = await this.generateTokens(user);
    const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 5);
    await this.userService.updateRefreshToken(user.id, hashRefreshToken);
    return tokens;
  }

  /**
   * Обработчик верификации токена.
   */
  async handleValidateUser(data: any): Promise<Boolean> {
    return await this.jwtService.verify(data.token);
  }

  async handleValidateRefreshToken(data: any): Promise<Boolean> {
    return await this.jwtService.verify(data.token, {
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
   * OAuth через Google
   */
  // async googleLogin(user: any) {
  //   if (!user) {
  //     return 'No user from Google';
  //   }

  //   const userEmail = user.email;
  //   const candidate = await this.userService.getUserByEmail(userEmail);

  //   if (candidate) {
  //     return this.generateToken(candidate);
  //   }

  //   const password = this.gen_password(15);

  //   return await this.registration({ email: userEmail, password });
  // }

  // async googleLoginViaDto(user: any) {
  //   if (!user.email || typeof user.email != 'string') {
  //     throw new RpcException(new BadRequestException('No user from Google'));
  //   }

  //   const userEmail = user.email;
  //   const candidate = await this.userService.getUserByEmail(userEmail);

  //   if (candidate) {
  //     const tokens = await this.generateTokens(candidate);
  //     const hashRefresh = await bcrypt.hash(tokens.refreshToken, 5);
  //     candidate.refreshToken = hashRefresh;
  //     await candidate.save();
  //     return tokens;
  //   }

  //   const genPass = this.gen_password(15);
  //   const password = await bcrypt.hash(genPass, 5);

  //   return await this.registration({ email: userEmail, password });
  // }

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

  /**
   * OAuth через vk
   */
  async vkLogin(query: VkLoginSdkDto): Promise<OutputJwtTokens> {

    if (query.uuid && query.token && query.user.id) {

      const candidateReg = await this.userService.getUserByUserId(query.user.id, true)

      if (candidateReg) {
        console.log('GENERATE TOKEN')
        const tokens = await this.generateTokens(candidateReg)
        const hashRefresh = await bcrypt.hash(tokens.refreshToken, 5)
        candidateReg.refreshToken = hashRefresh
        await candidateReg.save()
        return tokens
      }

      // if (candidateNotReg) {

      // }

      const userDTO = {
        uuid: query.uuid,
        token: query.token,
        user: {
          id: query.user.id
        }
      }

      return await this.registrationVk(userDTO);
    }

    throw new RpcException(
      new UnauthorizedException('Пользователь не авторизован'),
    );
  }

  /**
   * Валидация токена.
   * @param {string} token - JWT токен.
   */
  async validateVkToken(token: string) {
    const url = `https://api.vk.com/method/users.get?access_token=${token}&v=5.131`;
    const req = await lastValueFrom(this.httpService.get(url));
    if (req.data.error) {
        // throw new RpcException(new BadRequestException(`${JSON.stringify(req.data.error)}`))
        throw new RpcException(new BadRequestException(req.data.error.error_msg))
    }
    const tokenData = req.data.response[0];

    if (tokenData.id) {
      return true;
    }

    return false;
  }

  /**
   * Проверка электронной почты.
   * @param {string} email - Электронная почта.
   */
  async checkUserEmail(email: number) {
    const user = await this.userService.getUserByEmail(email);

    if (user) {
      throw new RpcException(
        new BadRequestException('Электронная почта уже занята'),
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Электронная почта свободна',
    };
  }

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
  async logout(user_id: number): Promise<any> {
    return await this.userService.removeRefreshToken(user_id);
  }


  /**
   * Добавить место жительства.
   * @param {CreateLocationDto[]} dto - DTO для добавления роли пользоветилю.
   */
   async createLocation(dto: CreateLocationDto[]): Promise<LocationUser[]> {
    return await this.locationService.createLocation(dto);
  }

  /**
   * Получить список всех стран.
   * @returns LocationUser - Список стран.
   */
   async getAllCountry(): Promise<LocationUser> {
    return await this.locationService.getAllCountry();
  } 

  /**
   * Получить список регионов.
   * @returns LocationUser - Список стран.
   */
   async getRegions(country: string): Promise<LocationUser> {
    return await this.locationService.getRegions(country);
  }

  /**
   * Получить список районов.
   * @returns LocationUser - Список районов.
   */
   async getLocality(region: string): Promise<LocationUser> {
    return await this.locationService.getLocality(region);
  }

  /**
   * Сохранить место жительства.
   * @param {CreateLocationDto} dto - DTO для добавления роли пользоветилю.
   */
   async saveLocation(dto: CreateLocationDto): Promise<any > {
    return await this.locationService.saveLocation(dto); 
  }
}
