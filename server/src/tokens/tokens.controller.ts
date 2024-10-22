import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OutputUserAndTokens } from 'src/common/dtos/output-user-and-tokens.dto';
import { UuidDevice } from 'src/common/dtos/uuid-device.dto';
import { TokensService } from 'src/tokens/tokens.service';
import { Request, Response } from 'express';

@Controller()
export class TokensController {
    constructor(private readonly tokenService: TokensService) {}

    @ApiTags('Токены')
    @ApiOperation({
        summary: 'Обновить токены для пользователя (требуется refreshToken в заголовке)',
    })
    @Post('/refresh-tokens')
    @ApiBody({ type: UuidDevice })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Операция прошла успешно.',
        type: OutputUserAndTokens,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'JWT токен не указан в заголовках',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Некоректный JWT токен',
    })
    async refreshTokens(
        @Body() dto: UuidDevice,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<OutputUserAndTokens> {
        const newToken = await this.tokenService.updateTokens(dto.uuid, req.cookies.refreshToken);
        res.cookie('refreshToken', newToken.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax',
        });

        return newToken;
    }
}
