import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ROLES } from 'src/common/constants/roles';
import { InfoService } from 'src/info/info.service';

@Controller('api')
export class InfoController {
    constructor(private readonly infoService: InfoService) {}

    @ApiTags('Общие')
    @Get('/get-common-info')
    @ApiOperation({
        summary: 'Размещение общей информации в модельном окне',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Операция прошла успешно.',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'JWT токен не указан в заголовках',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Некоректный JWT токен или роль пользователя',
    })
    async getInfo(): Promise<any> {
        return null;
    }
}
