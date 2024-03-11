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
import { VkLoginSdkDto } from '@app/models/dtos/vk-login-sdk.dto';
import { OutputUserAndTokens } from '@app/models/dtos/output-user-and-tokens.dto';
import { CreateResidencyDto } from '@app/models/dtos/create-residency.dto';
import { CreateRegistrationDto } from '@app/models/dtos/create-registration.dto';
import { LogoutUserDto } from '@app/models/dtos/logout-user.dto';
import { UsersService } from './users/users.service';
import { CreateDeclarationDto } from '@app/models/dtos/create-declaration.dto';
import { DeclarationService } from './declaration/declaration.service';
import { Declaration } from '@app/models/models/users/declaration.model';
import { GetDeclarationDto } from '@app/models/dtos/get-declaration.dto';
import { UpdatePersonaleDto } from '@app/models/dtos/update-personale.dto';
import { MessagesService } from './messages/messages.service';

@Controller()
export class AuthController {
  constructor(
              private readonly authService: AuthService,
              private readonly declarationService: DeclarationService,
              private readonly messagesService: MessagesService
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
  async logout(dto: LogoutUserDto): Promise<any> {
    await this.authService.logout(dto);
    return {
      message: 'Операция прошла успешно',
      statusCode: HttpStatusCode.Ok,
    };
  }

  /**
   * Удалить пользователя.
   * @param {number} user_id - Идентификатор пользователя.
   */
  @MessagePattern('deleteProfile')
  async deleteProfile(id: number): Promise<any> {
    await this.authService.deleteProfile(id);
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
  async handleUpdateTokens(@Payload() data: RefreshTokensDto): Promise<OutputUserAndTokens> {
    return await this.authService.updateTokens(data.uuid, data.refreshToken);
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
   * Получить всех пользователей.
   * @param {number} id - Идентификатор пользователя.
   * @returns Users - Найденный пользователь.
   */
  @MessagePattern('getAllUsers')
  async getAllUsers(): Promise<User[]> {
    return await this.authService.getAllUsers();
  }

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
  async vkLogin(@Payload() query: VkLoginSdkDto): Promise<User> {
    return await this.authService.vkLogin(query);
  }

  /**
   * Внесение в базу данных информацию о регистрации
   */
  @MessagePattern('setRegistration')
  async setRegistration(@Payload() dto: CreateRegistrationDto): Promise<OutputUserAndTokens> {
    return await this.authService.setRegistration(dto)
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
   async saveLocation(@Payload() dto: CreateResidencyDto): Promise<User> {
    console.log(dto, 'dto residency')
     return await this.authService.createResidency(dto); 
   }

   /**
   * Добавление Декларации Родной партии
   */
  @MessagePattern('addDeclaration')
  async addDeclaration(@Payload() dto: CreateDeclarationDto): Promise<User> {
    return await this.authService.addDeclaration(dto)
  }

  /**
   * Добавление Декларации Родной партии
   */
  @MessagePattern('getDeclaration')
  async getDeclaration(@Payload() id: number): Promise<GetDeclarationDto> {
    return await this.authService.getDeclaration(id)
  }

  /**
   * Добавление Декларации Родной партии
   */
  @MessagePattern('udatePersonaleData')
  async udatePersonaleData(@Payload('secret') secret: string, @Payload('form') form: UpdatePersonaleDto): Promise<User> {
    return await this.authService.udatePersonaleData(secret, form)
  }

  /**
   * Внесение в базу данных информацию о регистрации
   */
  @MessagePattern('sendMessage')
  async addMessage(@Payload() dto: any): Promise<any> {
      return await this.messagesService.addMessage(dto)
  }

}
