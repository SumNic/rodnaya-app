import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LogoutUserDto } from 'src/common/dtos/logout-user.dto';
import { OutputUserAndTokens } from 'src/common/dtos/output-user-and-tokens.dto';
import { RefreshTokensDto } from 'src/common/dtos/refresh-tokens.dto';
import { Token } from 'src/common/models/users/tokens.model';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/common/models/users/user.model';
import { OutputJwtTokens } from 'src/common/dtos/output-jwt-tokens.dto';
import { Group } from 'src/common/models/groups/groups.model';
import { Declaration } from 'src/common/models/users/declaration.model';
import { Residency } from 'src/common/models/users/residency.model';
import { Role } from 'src/common/models/users/role.model';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class TokensService {
    constructor(
        @InjectModel(Token) private readonly tokenRepository: typeof Token,
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async getRefreshToken(uuid: string): Promise<Token> {
        const token = await this.tokenRepository.findOne({
            where: { uuid: uuid },
        });

        if (!token) return;

        return token;
    }

    async createRefreshToken(dto: RefreshTokensDto): Promise<Token> {
        const token = await this.tokenRepository.create(dto);
        return token;
    }

    async updateRefreshToken(dto: RefreshTokensDto): Promise<Token> {
        const token = await this.tokenRepository.findOne({
            where: { uuid: dto.uuid },
        });

        if (!token) {
            throw new HttpException('Токен не найден', HttpStatus.FORBIDDEN);
        }

        token.refreshToken = dto.refreshToken;
        await token.save();
        return token;
    }

    async removeRefreshToken(dto: LogoutUserDto) {
        if (dto.allDeviceExit) {
            await this.tokenRepository.update(
                { refreshToken: null },
                {
                    where: {
                        userId: dto.id,
                    },
                },
            );
        } else {
            const token = await this.tokenRepository.findOne({
                where: { uuid: dto.uuid },
            });

            if (!token) {
                throw new HttpException('Токен не найден', HttpStatus.FORBIDDEN);
            }

            token.refreshToken = null;
            await token.save();
        }
    }

    async updateTokens(uuid: string, refreshToken: string): Promise<OutputUserAndTokens> {
        const token = await this.getRefreshToken(uuid);

        if (!token) {
            throw new HttpException('Доступ запрещен', HttpStatus.UNAUTHORIZED);
        }

        const user = await this.userService.getUserWithModel(token.userId, [
            { model: Residency },
            { model: Declaration },
            { model: Role },
            {
                model: Group,
                as: 'userGroups',
            },
            {
                model: Group,
                as: 'adminGroups',
            },
        ]);

        if (!user) {
            throw new HttpException('Доступ запрещен', HttpStatus.UNAUTHORIZED);
        }

        const refreshTokenEquals = await bcrypt.compare(refreshToken, token.refreshToken);

        if (!refreshTokenEquals) {
            throw new HttpException('Доступ запрещен', HttpStatus.UNAUTHORIZED);
        }

        const tokens = await this.generateTokens(user);
        const hashRefreshToken = await bcrypt.hash(tokens.refreshToken, 5);
        const refreshTokenDb = await this.updateRefreshToken({
            uuid: uuid,
            refreshToken: hashRefreshToken,
        });
        return { user, ...tokens };
    }

    async handleValidateRefreshToken(refreshToken: string): Promise<Boolean> {
        return await this.jwtService.verify(refreshToken, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        });
    }

    async generateTokens(user: User): Promise<OutputJwtTokens> {
        const payload = {
            id: user.id,
            roles: user.roles,
        };
        const accessSettings = {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: '15m',
        };
        const refreshSettings = {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        };
        const token = await this.jwtService.signAsync(payload, accessSettings);
        const refreshToken = await this.jwtService.signAsync(payload, refreshSettings);
        return {
            token,
            refreshToken,
        };
    }

    generateRandomString(length: number = 64): string {
        return randomBytes(length).toString('base64url'); // base64-url safe
    }

    sha256Base64Url(input: string): string {
        const hash = createHash('sha256').update(input).digest();
        // base64-url encode
        return hash.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    createPKCE() {
        const code_verifier = this.generateRandomString(64);
        const code_challenge = this.sha256Base64Url(code_verifier);
        const state = this.generateRandomString(32);
        return { code_verifier, code_challenge, state };
    }
}
