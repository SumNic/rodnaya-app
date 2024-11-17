import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateRegistrationDto } from 'src/common/dtos/create-registration.dto';
import { LogoutUserDto } from 'src/common/dtos/logout-user.dto';
import { OutputUserAndTokens } from 'src/common/dtos/output-user-and-tokens.dto';
import { User } from 'src/common/models/users/user.model';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { VkLoginSdkDto } from 'src/common/dtos/vk-login-sdk.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly tokenService: TokensService,
        private readonly userService: UsersService,
    ) {}

    async handleValidateUser(token: any): Promise<Boolean> {
        try {
            return await this.jwtService.verify(token);
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async logout(dto: LogoutUserDto) {
        try {
            return await this.tokenService.removeRefreshToken(dto);
        } catch (err) {
            throw new HttpException(`Ошибка в logout: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async handleValidateUserWithRoles(data: any): Promise<Boolean> {
        const checkToken = await this.jwtService.verifyAsync(data.token);
        const checkRoles = await checkToken.roles.some((role: any) => data.requiredRoles.includes(role.value));

        if (checkToken && checkRoles) {
            return checkToken;
        }

        throw new HttpException('Нет доступа', HttpStatus.UNAUTHORIZED);
    }

    async setRegistration(dto: CreateRegistrationDto): Promise<OutputUserAndTokens> {
        const candidate = await this.userService.getUserWithoutMessages(dto.id);

        if (!candidate) {
            throw new HttpException('Данный пользователь не существует.', HttpStatus.UNAUTHORIZED);
        }

        if (dto.secret !== candidate.secret) {
            throw new HttpException('Нет доступа.', HttpStatus.UNAUTHORIZED);
        }

        if (!candidate.isRegistration) {
            // Если пользователь не зарегистрирован
            candidate.isRegistration = true;
            await candidate.save();
        }

        return await this.login(candidate, dto.uuid);
    }

    private async login(candidate: User, uuid: string): Promise<OutputUserAndTokens> {
        const tokens = await this.tokenService.generateTokens(candidate); // Создаем пару токен и рефреш токен
        const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 5); // Хешируем рефреш токен

        // Проверяем, есть ли токен для устройства с указанным uuid в базе данных
        const tokenFromDataBase = await this.tokenService.getRefreshToken(uuid);

        if (!tokenFromDataBase) {
            const newRefreshToken = await this.tokenService.createRefreshToken({
                uuid,
                refreshToken: hashRefreshToken,
            });
            await candidate.$add('tokens', [newRefreshToken.id]);
            candidate.tokens = [newRefreshToken];
            await candidate.save();
        } else {
            const updateRefreshToken = await this.tokenService.updateRefreshToken({
                uuid,
                refreshToken: hashRefreshToken,
            });
        }
        return { user: candidate, secret: candidate.secret, ...tokens };
    }

    async deleteProfile(id: number, secret: string): Promise<any> {
        const user = await this.userService.getUser(id);

        await this.tokenService.removeRefreshToken({
            id,
            uuid: null,
            allDeviceExit: true,
        });
        user.roles = null;
        user.declaration = null;
        user.tokens = null;

        user.update({
            first_name: null,
            last_name: null,
            photo_50: null,
            photo_max: null,
            isRegistration: false,
            isDelProfile: true,
        });
        await user.save();
        return;
    }

    async restoreProfile(id: number, secret: string): Promise<boolean> {
        const user = await this.userService.getUser(id);

        if (secret !== user.secret) {
            throw new HttpException('Нет доступа.', HttpStatus.BAD_REQUEST);
        }

        await user.update({ isDelProfile: false });
        await user.save();

        return user.isDelProfile;
    }

    async vkLogin(query: VkLoginSdkDto): Promise<User> {
        if (query.uuid && query.token) {
            const dto = {
                uuid: query.uuid,
                token: query.token,
            };

            const candidate = await this.getOrCreateUser(dto);

            if (!candidate) {
                throw new HttpException('Во время авторизации произошла ошибка.', HttpStatus.UNAUTHORIZED);
            }

            return candidate;
        }
    }

    async getOrCreateUser(dto: VkLoginSdkDto): Promise<User> {
        const DATA = {
            v: this.configService.get<string>('VK_VERSION'),
            token: dto.token,
            access_token: this.configService.get<string>('VK_SERVICE_SECRET'),
            uuid: dto.uuid,
        };

        let response = await fetch('https://api.vk.com/method/auth.exchangeSilentAuthToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `v=${DATA.v}&token=${DATA.token}&access_token=${DATA.access_token}&uuid=${DATA.uuid}`,
        });

        if (response.ok) {
            let result = await response.json();
            if (result.response) {
                const arrayUsersFromVk = await this.getDataUser(result.response.access_token, result.response.user_id);
                const userVk = arrayUsersFromVk.response[0];
                const candidate = await this.userService.getUserByVkId(userVk.id); // Проверяем, есть ли пользователь с данным ID в базе данных

                if (candidate && !candidate.isDelProfile) return candidate;

                if (candidate && candidate.isDelProfile) {
                    // Восстановление профиля
                    return await this.userService.updateUser({
                        vk_id: userVk.id,
                        first_name: userVk.first_name,
                        last_name: userVk.last_name,
                        photo_50: userVk.photo_50,
                        photo_max: userVk.photo_max,
                    });
                }

                const newUser = await this.userService.createUser({
                    vk_id: userVk.id,
                    first_name: userVk.first_name,
                    last_name: userVk.last_name,
                    photo_50: userVk.photo_50,
                    photo_max: userVk.photo_max,
                    secret: dto.uuid,
                });

                return newUser;
            }
        }
        return null;
    }

    private async getDataUser(access_token: string, id: string): Promise<any> {
        if (access_token && id) {
            let params = {
                v: this.configService.get<string>('VK_VERSION'),
                user_ids: id,
                fields: 'photo_50,photo_max,first_name,last_name',
                access_token: access_token,
            };

            const response = await fetch(`https://api.vk.com/method/users.get?${new URLSearchParams(params).toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Преобразуем полученный ответ в JSON.
            return response.json();
        }
    }
}
