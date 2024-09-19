import { JwtAuthGuard } from '@app/common';
import { AUTH_SERVICE } from '@app/common/auth/service';
import { CreateMessageDto } from '@app/models/dtos/create-message.dto';
import { EndMessageDto } from '@app/models/dtos/end-message.dto';
import { EndReadMessageDto } from '@app/models/dtos/end-read-message.dto';
import { FoulSendMessageDto } from '@app/models/dtos/foul-send-message.dto.js';
import { Body, Controller, Get, HttpStatus, Inject, Post, Query, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { catchError } from 'rxjs';

@ApiTags('Администратор')
@Controller()
export class AppAdminController {
    constructor(@Inject(AUTH_SERVICE) private adminClient: ClientProxy, private configService: ConfigService) {}

    @ApiOperation({ summary: 'Сообщение о нарушении правил' })
    @Post('/report-violation')
    @ApiBody({ type: CreateMessageDto })
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
    async reportViolation(@Body() dto: FoulSendMessageDto) {
        return this.adminClient.send('reportViolation', dto).pipe(
            catchError(async (error) => {
                return new RpcException(error);
            }),
        );
    }

    
}
