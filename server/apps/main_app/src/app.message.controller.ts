import { JwtAuthGuard } from '@app/common';
import { AUTH_SERVICE } from '@app/common/auth/service';
import { CreateMessageDto } from '@app/models/dtos/create-message.dto';
import { EndMessageDto } from '@app/models/dtos/end-message.dto';
import { EndReadMessageDto } from '@app/models/dtos/end-read-message.dto.js';
import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Inject,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { catchError } from 'rxjs';

@ApiTags('Сообщения')
@Controller()
export class AppMessagesController {
    constructor(
        @Inject(AUTH_SERVICE) private messagesClient: ClientProxy,
        private configService: ConfigService,
    ) {}

    @ApiOperation({ summary: 'Добавление нового сообщения' })
    @Post('/send-message')
    @ApiBody({ type: CreateMessageDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Сообщение добавлено',
        // type: OutputUserAndTokens,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async addMessage(@Body() dto: CreateMessageDto) {
        return this.messagesClient.send('sendMessage', dto).pipe(
            catchError(async (error) => {
                return new RpcException(error);
            }),
        );
    }

    @ApiOperation({
        summary: 'Получение всех сообщений для определенного location',
    })
    @Get('/get-all-messages')
    @ApiBody({ type: CreateMessageDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Декларация добавлена',
        // type: OutputUserAndTokens,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async getAllMessage(@Query() query: any) {
        return this.messagesClient.send('getAllMessages', query).pipe(
            catchError(async (error) => {
                return new RpcException(error);
            }),
        );
    }

    @ApiOperation({
        summary:
            'Получение количества всех сообщений для определенного location',
    })
    @Get('/get-count-no-read-messages')
    @ApiBody({ type: CreateMessageDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Декларация добавлена',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async getCountNoReadMessages(@Query() query: EndMessageDto) {
        return this.messagesClient.send('getCountNoReadMessages', query).pipe(
            catchError(async (error) => {
                return new RpcException(error);
            }),
        );
    }

    @ApiOperation({
        summary:
            'Получение id последнего прочитанного сообщения для определенного location',
    })
    @Get('/get-end-read-messages-id')
    @ApiBody({ type: CreateMessageDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Данные получены',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async getEndReadMessagesId(@Query() query: EndMessageDto) {
        return this.messagesClient.send('getEndReadMessagesId', query).pipe(
            catchError(async (error) => {
                return new RpcException(error);
            }),
        );
    }

    @ApiOperation({
        summary:
            'Устанавливает последнее прочитанное сообщение для определенного location',
    })
    @Post('/set-end-read-messages-id')
    @ApiBody({ type: EndReadMessageDto })
    @UseGuards(JwtAuthGuard)
    async setEndReadMessagesId(@Body() dto: EndReadMessageDto) {
        console.log(dto, 'dto');
        return this.messagesClient.send('setEndReadMessagesId', dto).pipe(
            catchError(async (error) => {
                return new RpcException(error);
            }),
        );
    }
}
