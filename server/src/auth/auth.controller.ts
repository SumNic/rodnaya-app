import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ROLES } from 'src/common/constants/roles';
import { CreateRegistrationDto } from 'src/common/dtos/create-registration.dto';
import { OutputUserAndTokens } from 'src/common/dtos/output-user-and-tokens.dto';
import { User } from 'src/common/models/users/user.model';
import { Response } from 'express';
import { VkLoginSdkDto } from 'src/common/dtos/vk-login-sdk.dto';
import { LogoutUserDto } from 'src/common/dtos/logout-user.dto';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiTags('Авторизация')
    @ApiOperation({
        summary: 'Разлогинить пользователя (Удалить refreshToken у пользователя)',
    })
    @Post('/logout')
    @ApiBody({ type: LogoutUserDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Пользователь успешно разлогинен',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Пользователь не найден',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'JWT токен не указан в заголовках',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Некоректный JWT токен',
    })
    @UseGuards(JwtAuthGuard)
    async logout(@Body() dto: LogoutUserDto): Promise<any> {
        await this.authService.logout(dto);
        return {
            message: 'Операция прошла успешно',
            statusCode: HttpStatusCode.Ok,
        };
    }

    @ApiTags('Авторизация')
    @ApiOperation({ summary: 'Авторизация пользователя' })
    @Post('/set-registration')
    @ApiBody({ type: CreateRegistrationDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Успешная регистрация',
        type: OutputUserAndTokens,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    async setRegistration(@Body() dto: CreateRegistrationDto, @Res({ passthrough: true }) res: Response): Promise<OutputUserAndTokens> {

        const registration = await this.authService.setRegistration(dto);
        res.cookie('refreshToken', registration.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax',
        });

        return registration;
    }

    @ApiTags('Авторизация')
    @ApiOperation({
        summary: 'Удалить пользователя',
    })
    @Post('/delete-profile')
    @ApiBody({ type: LogoutUserDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Пользователь успешно разлогинен',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Пользователь не найден',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'JWT токен не указан в заголовках',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Некоректный JWT токен',
    })
    @UseGuards(JwtAuthGuard)
    async deleteProfile(@Body('id') id: number, @Body('secret') secret: string) {
        await this.authService.deleteProfile(id, secret);
        return {
            message: 'Операция прошла успешно',
            statusCode: HttpStatusCode.Ok,
        };
    }

    @ApiTags('Авторизация')
    @ApiOperation({
        summary: 'Удалить пользователя',
    })
    @Post('/restore-profile')
    @ApiBody({ type: LogoutUserDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Пользователь успешно разлогинен',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Пользователь не найден',
    })
    async restoreProfile(@Body('id') id: number, @Body('secret') secret: string): Promise<boolean> {
        return await this.authService.restoreProfile(id, secret);
    }

    @ApiTags('Авторизация')
    @ApiOperation({ summary: 'Auth через VK SDK' })
    @Post('/loginByVk')
    @ApiBody({ type: VkLoginSdkDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Успешная регистрация',
        type: User,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Пользователь уже существует',
    })
    @ApiBody({ type: VkLoginSdkDto })
    async registrationVk(@Body() dto: VkLoginSdkDto) {
        return await this.authService.vkLogin(dto);
    }

    @ApiTags('Авторизация')
    @Get('/check-admin')
    @ApiOperation({
        summary: 'Проверка на наличие прав администратора. (Необходим JWT токен)',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'У пользователя есть права администратора.',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'У пользователя нет прав администратора.',
    })
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'JWT токен не указан в заголовках',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Некоректный JWT токен или роль пользователя',
    })
    checkAdmin() {
        return {
            statusCode: HttpStatus.OK,
            message: 'У пользователя есть права администратора.',
        };
    }
}
