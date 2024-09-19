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
import { DeleteUserDto } from '@app/models/dtos/delete-user.dto';
import { GetMessagesDto } from '@app/models/dtos/get-messages.dto';
import { FilesService } from './files/files.service';
import { Express } from 'express';
import { Files } from '@app/models/models/files/files.model';
import { CreateMessageDto } from '@app/models/dtos/create-message.dto';
import { Messages } from '@app/models/models/messages/messages.model';
import { EndReadMessageDto } from '@app/models/dtos/end-read-message.dto';

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly declarationService: DeclarationService,
        private readonly messagesService: MessagesService,
        private readonly filesService: FilesService,
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
    async deleteProfile(dto: DeleteUserDto): Promise<any> {
        await this.authService.deleteProfile(dto.id, dto.secret);
        return {
            message: 'Операция прошла успешно',
            statusCode: HttpStatusCode.Ok,
        };
    }

    /**
     * Удалить пользователя.
     * @param {number} user_id - Идентификатор пользователя.
     */
    @MessagePattern('restoreProfile')
    async restoreProfile(dto: DeleteUserDto): Promise<boolean> {
        return await this.authService.restoreProfile(dto.id, dto.secret);
    }

    /**
     * Обновление JWT токенов.
     * @param {any} data - Объект содержащий token
     */
    @MessagePattern('refreshTokens')
    async handleUpdateTokens(
        @Payload() data: RefreshTokensDto,
    ): Promise<OutputUserAndTokens> {
        return await this.authService.updateTokens(
            data.uuid,
            data.refreshToken,
        );
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
    async setRegistration(
        @Payload() dto: CreateRegistrationDto,
    ): Promise<OutputUserAndTokens> {
        return await this.authService.setRegistration(dto);
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
        return await this.authService.createResidencyForUser(dto);
    }

    /**
     * Добавление Декларации Родной партии
     */
    @MessagePattern('addDeclaration')
    async addDeclaration(@Payload() dto: CreateDeclarationDto): Promise<User> {
        return await this.authService.addDeclaration(dto);
    }

    /**
     * Добавление Декларации Родной партии
     */
    @MessagePattern('getDeclaration')
    async getDeclaration(@Payload() id: number): Promise<GetDeclarationDto> {
        return await this.authService.getDeclaration(id);
    }

    /**
     * Добавление Декларации Родной партии
     */
    @MessagePattern('udatePersonaleData')
    async udatePersonaleData(
        @Payload('secret') secret: string,
        @Payload('form') form: UpdatePersonaleDto,
    ): Promise<User> {
        return await this.authService.udatePersonaleData(secret, form);
    }

    /**
     * Добавление нового сообщения
     */
    @MessagePattern('sendMessage')
    async addMessage(@Payload() dto: CreateMessageDto): Promise<number> {
        return await this.messagesService.addMessage(dto);
    }

    /**
     * Получение сообщений
     */
    @MessagePattern('getAllMessages')
    async getAllMessage(@Payload() dto: GetMessagesDto): Promise<Messages[]> {
        return await this.messagesService.getAllMessage(dto);
    }

    /**
     * Получение сообщений
     */
    @MessagePattern('getNextMessages')
    async getNextMessage(@Payload() dto: GetMessagesDto): Promise<Messages[]> {
        return await this.messagesService.getNextMessage(dto);
    }

    /**
     * Получение сообщений
     */
    @MessagePattern('getPreviousMessages')
    async getPreviousMessage(@Payload() dto: GetMessagesDto): Promise<Messages[]> {
        return await this.messagesService.getPreviousMessage(dto);
    }

    /**
     * Получение сообщений
     */
    @MessagePattern('getCountNoReadMessages')
    async getCountNoReadMessages(@Payload() dto: GetMessagesDto): Promise<number> {
        return await this.messagesService.getCountNoReadMessages(dto);
    }

    /**
     * Получение id последних прочитанных сообщений
     */
    @MessagePattern('getEndReadMessagesId')
    async getEndReadMessagesId(@Payload() dto: GetMessagesDto): Promise<number> {
        return await this.messagesService.getEndReadMessagesId(dto);
    }

    /**
     * Установка id последних прочитанных сообщений
     */
    @MessagePattern('setEndReadMessagesId')
    async setEndReadMessagesId(@Payload() dto: EndReadMessageDto) {
        return await this.messagesService.setEndReadMessagesId(dto);
    }

    /**
     * Сохранение файла
     */
    @MessagePattern('saveFile')
    async saveFile(@Payload() file: Express.Multer.File): Promise<Files> {
        return await this.filesService.saveFile(file);
    }

    /**
     * Сохранение аватара
     */
    @MessagePattern('saveAvatar')
    async saveAvatar(
        @Payload('file') file: Express.Multer.File,
        @Payload('userId') userId: string,
    ): Promise<User> {
        return await this.authService.saveAvatar(file, userId);
    }
}
