// import { FoulSendMessageDto } from '@app/models/dtos/foul-send-message.dto';
import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from 'src/admin/admin.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ROLES } from 'src/common/constants/roles';
import { FoulSendMessageDto } from 'src/common/dtos/foul-send-message.dto';
import { FooulSendMessage } from 'src/common/models/admin/foulSendMessage.model';
// import { catchError } from 'server/node_modules/rxjs/src';

@Controller('api')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @ApiTags('админ')
    @ApiOperation({ summary: 'Сообщение о нарушении правил' })
    @Post('/report-violation')
    @ApiBody({ type: FoulSendMessageDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Сообщение о нарушении правил доставлено',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async reportViolation(@Body() dto: FoulSendMessageDto): Promise<string> {
        return await this.adminService.reportViolation(dto);
    }

    @ApiOperation({ summary: 'Получить список сообщений, нарушающих правила' })
    @Get('/get-foul-messages')
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Сообщение о нарушении правил доставлено',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    async getFoulMessages(): Promise<FooulSendMessage[]> {
        return await this.adminService.getFoulMessages();
    }

    @ApiOperation({ summary: 'Сообщение о нарушении правил' })
    @Post('/fetch-cleaning-is-complete')
    @ApiBody({ type: Number })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Сообщение о нарушении правил доставлено',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    async fetchCleaningIsComplete(@Body('id_foul_message') id_foul_message: number, @Body('source')source: string): Promise<boolean> {
        return await this.adminService.fetchCleaningIsComplete(id_foul_message, source);
    }
}
