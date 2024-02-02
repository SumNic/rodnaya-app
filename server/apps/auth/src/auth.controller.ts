import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import {
  AddRoleDto,
  CreateUserDto,
  OutputJwtTokens,
  RefreshTokensDto,
  Role,
  User,
  // VkLoginDto, 
} from '@app/models';
import { HttpStatusCode } from 'axios';
import { RmqService } from '@app/common'; 
import { VkLoginSdkDto } from '@app/models/dtos/vk-login-sdk.dto';
import { OutputUserIdAndTokens } from '@app/models/dtos/output-user-id-and-tokens.dto';
import { ResidencyService } from './residency/residency.service';
import { CreateResidencyDto } from '@app/models/dtos/create-residency.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly rmqService: RmqService,
              private readonly residencyService: ResidencyService,
    ) {}

  /**
   * Регистрация нового пользователя.
   * @param {CreateRoleDto} dto - DTO для создания пользователя. 
   * @returns TokenResponseDto - JWT токен.
   */
  // @MessagePattern('registration')
  // async registration(@Payload() dto: CreateUserDto): Promise<OutputJwtTokens> {
  //   return await this.authService.registration(dto); 
  // }

  /**
   * Авторизация пользователя.
   * @param {CreateRoleDto} dto - DTO для создания пользователя.
   * @returns TokenResponseDto - JWT токен.
   */
  // @MessagePattern('login')
  // async login(@Payload() dto: CreateUserDto): Promise<OutputJwtTokens> {
  //   return await this.authService.login(dto);
  // }

  /**
   * Разлогинить пользователя.
   * @param {number} user_id - Идентификатор пользователя.
   */
  @MessagePattern('logout')
  async logout(uuid: string): Promise<any> {
    await this.authService.logout(uuid);
    return {
      message: 'Операция прошла успешно',
      statusCode: HttpStatusCode.Ok,
    };
  }

  /**
   * Обновление JWT токенов.
   * @param {any} data - Объект содержащий token
   */
  @MessagePattern('refreshTokens')
  async handleUpdateTokens(
    @Payload() data: RefreshTokensDto,
  ): Promise<OutputJwtTokens> {
    return await this.authService.updateTokens(data.uuid, data.hashRefreshToken);
  }

  /**
   * Проверка валидации JWT токена.
   * @param {any} data - Объект содержащий token
   */
  @MessagePattern('validate_user')
  async handleValidateUser(@Payload() data: any): Promise<Boolean> {
    return await this.authService.handleValidateUser(data);
  }

  /**
   * Проверка валидации JWT refresh токена.
   * @param {any} data - Объект содержащий token
   */
  @MessagePattern('validate_refresh_token')
  async handleValidateRefreshToken(@Payload() data: any): Promise<Boolean> {
    return await this.authService.handleValidateRefreshToken(data);
  }

  /**
   * Проверка валидации JWT токена.
   * @param {any} data - Объект содержащий token
   */
  @MessagePattern('validate_user_with_roles')
  async handleValidateUserWithRoles(@Payload() data: any): Promise<Boolean> {
    return await this.authService.handleValidateUserWithRoles(data);
  }

  /**
   * Создание пользователя с правами администратора.
   * @param {CreateUserDto} dto - DTO для создания пользователя.
   * @returns TokenResponseDto - JWT токен.
   */
  // @MessagePattern('createSuperUser')
  // async createSuperUser(
  //   @Payload() dto: CreateUserDto,
  // ): Promise<TokenResponseDto> {
  //   return await this.authService.createSuperUser(dto);
  // }

  /**
   * Получить пользователя.
   * @param {number} id - Идентификатор пользователя.
   * @returns User - Найденный пользователь.
   */
  @MessagePattern('getUser')
  async getUser(@Payload() id: number): Promise<User> {
    return await this.authService.getUser(id);
  }

  /**
   * Auth через vk
   */
  @MessagePattern('loginByVk')
  async vkLogin(@Payload() query: VkLoginSdkDto): Promise<OutputUserIdAndTokens> {
    return await this.authService.vkLogin(query);
  }

  /**
   * Внесение в базу данных информацию о регистрации
   */
  @MessagePattern('setRegistration')
  async setRegistration(@Payload() id: number): Promise<OutputUserIdAndTokens> {
    return await this.authService.setRegistration(id);
  }

  /**
   * Проверка занятости email.
   * @param {string} email - Email пользователя. 
   */
  // @MessagePattern('checkUserEmail') 
  // async checkUserEmail(@Payload() email: number): Promise<any> {
  //   return await this.authService.checkUserEmail(email);
  // }

  /**
   * Добавить роль пользователю.
   * @param {AddRoleDto} dto - DTO для добавления роли пользоветилю.
   */
  @MessagePattern('userAddRole')
  async userAddRole(@Payload() dto: AddRoleDto): Promise<AddRoleDto> {
    return await this.authService.userAddRole(dto);
  }

  /**
   * Удалить роль пользователю.
   * @param {AddRoleDto} dto - DTO для добавления роли пользоветилю.
   */
  @MessagePattern('userRemoveRole')
  async userRemoveRole(@Payload() dto: AddRoleDto): Promise<AddRoleDto> {
    return await this.authService.userRemoveRole(dto);
  }

  /**
   * Получить список всех ролей.
   * @returns Role[] - Список найденных ролей.
   */
  @MessagePattern('getAllRoles')
  async getAllRoles(): Promise<Role[]> {
    return await this.authService.getAllRoles();
  }

  /**
   * Сохранить место жительства.
   * @returns LocationUser - Список районов и городв.
   */
   @MessagePattern('createResidency')
   async saveLocation(@Payload() dto: CreateResidencyDto): Promise<CreateUserDto> {
    console.log('auth controller')
     return await this.authService.createResidency(dto); 
   }
}
