import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ROLES } from 'src/common/constants/roles';
import { MobileAppInfoDto } from 'src/common/dtos/mobile-app-info.dto';
import { InfoService } from 'src/info/info.service';

@Controller('api')
export class InfoController {
    constructor(private readonly infoService: InfoService) {}

    @ApiTags('Общие')
    @ApiOperation({ summary: 'Версия приложения' })
    @Post('/add-version-app')
    @ApiBody({ type: Number })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Версия приложения добавлена',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    async addOVersionApp(@Body('versionApp') versionApp: string) {
        return await this.infoService.addVersionApp(versionApp);
    }

    @ApiTags('Общие')
    @Get('/get-common-info')
    @ApiOperation({
        summary: 'Размещение общей информации в модельном окне',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Операция прошла успешно.',
        type: MobileAppInfoDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'JWT токен не указан в заголовках',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Некоректный JWT токен или роль пользователя',
    })
    async getInfo(): Promise<MobileAppInfoDto> {
        return this.infoService.getInfoMobilApp();
    }
}
