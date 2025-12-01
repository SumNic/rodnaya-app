import { Body, Controller, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AddFcmDeviceTokenDto } from 'src/common/dtos/add-fcm-device-token';
import { AuthenticatedRequest } from 'src/common/types/types';
import { DeviceTokensService } from 'src/device-tokens/device-tokens.service';

@Controller('api')
export class DeviceTokensController {
    constructor(private readonly deviceTokenService: DeviceTokensService) {}

    @ApiTags('FCM токены')
    @ApiOperation({
        summary: 'Добавить FCM токены для пользователя',
    })
    @Post('/fcm-device-tokens')
    @ApiBody({ type: AddFcmDeviceTokenDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Операция прошла успешно.',
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
    async addDeviceToken(@Req() req: AuthenticatedRequest, @Body() dto: AddFcmDeviceTokenDto) {
        await this.deviceTokenService.addDeviceToken(req, dto);
    }
}
