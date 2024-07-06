import { RefreshTokensDto } from '@app/models';
import { LogoutUserDto } from '@app/models/dtos/logout-user.dto';
import { Token } from '@app/models/models/users/tokens.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class TokensService {
    constructor(
        @InjectModel(Token) private readonly tokenRepository: typeof Token,
    ) {}

    /**
     * Получить refreshToken по UUID.
     * @param {string} uuid - uuid пользователя.
     * @returns User - Найденный пользователь.
     */
    async getRefreshToken(uuid: string): Promise<Token> {
        const token = await this.tokenRepository.findOne({
            where: { uuid: uuid },
        });

        if (!token) return;

        return token;
    }

    /**
     * Создать запись в базе данных refresh token для используемого устройства.
     * @param {string} email - Email пользователя.
     * @returns User - Найденный пользователь.
     */
    async createRefreshToken(dto: RefreshTokensDto): Promise<Token> {
        const token = await this.tokenRepository.create(dto);
        // let role = await this.roleService.getRoleByValue(ROLES.USER);

        // if (!role) {
        //   role = await this.roleService.create({ value: ROLES.USER });
        // }

        // await user.$set('roles', [role.id]);
        // user.roles = [role];

        return token;
    }

    /**
     * Обновляет refreshToken пользователя.
     *
     * @param {RefreshTokensDto} dto - Объект передачи данных, содержащий uuid и новый refreshToken.
     * @returns {Promise<Token>} - Обновленный объект Token.
     * @throws {RpcException} - Выбрасывает исключение RpcException, если токен не найден.
     */
    async updateRefreshToken(dto: RefreshTokensDto): Promise<Token> {
        // Находит токен по uuid
        const token = await this.tokenRepository.findOne({
            where: { uuid: dto.uuid },
        });

        // Если токен не найден, выбрасывает исключение RpcException
        if (!token) {
            throw new RpcException(new NotFoundException('Токен не найден'));
        }

        // Обновляет refreshToken
        token.refreshToken = dto.refreshToken;

        // Сохраняет изменения
        await token.save();

        // Возвращает обновленный объект Token
        return token;
    }

    /**
     * Удаляет refreshToken у пользователя.
     * Если allDeviceExit равно true, удаляет все refreshTokens для пользователя.
     * Если allDeviceExit равно false, удаляет только refreshToken для указанного uuid.
     * @param {LogoutUserDto} dto - Объект передачи данных, содержащий идентификатор пользователя и uuid.
     * @throws RpcException(NotFoundException) - Если токен не найден.
     */
    async removeRefreshToken(dto: LogoutUserDto) {
        if (dto.allDeviceExit) {
            // Обновляет все refreshTokens для пользователя, установив их в null
            const tokens = await this.tokenRepository.update(
                { refreshToken: null },
                {
                    where: {
                        userId: dto.id,
                    },
                },
            );
        } else {
            // Ищет токен по uuid
            const token = await this.tokenRepository.findOne({
                where: { uuid: dto.uuid },
            });

            // Выбрасывает исключение, если токен не найден
            if (!token) {
                throw new RpcException(
                    new NotFoundException('Токен не найден'),
                );
            }

            // Устанавливает refreshToken в null и сохраняет изменения
            token.refreshToken = null;
            await token.save();
        }
    }
}
