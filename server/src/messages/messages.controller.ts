import { Body, Controller, Get, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ROLES } from 'src/common/constants/roles';
import { BlockedMessagesDto } from 'src/common/dtos/blocked-messages.dto';
import { CreateMessageDto } from 'src/common/dtos/create-message.dto';
import { EndMessageDto } from 'src/common/dtos/end-message.dto';
import { EndReadMessageDto } from 'src/common/dtos/end-read-message.dto';
import { GetMessagesDto } from 'src/common/dtos/get-messages.dto';
import { Messages } from 'src/common/models/messages/messages.model';
import { MessagesService } from 'src/messages/messages.service';

@ApiTags('Сообщения')
@Controller()
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

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
    async addMessage(@Body() dto: CreateMessageDto): Promise<number> {
        return await this.messagesService.addMessage(dto)
    }

    @ApiOperation({
        summary: 'Получение всех сообщений для определенного location',
    })
    @Get('/get-all-messages')
    @ApiBody({ type: CreateMessageDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async getAllMessage(@Query() query: GetMessagesDto): Promise<Messages[]> {
        return await this.messagesService.getAllMessage(query);
    }

    @ApiOperation({
        summary: 'Получение последующих сообщений для определенного location',
    })
    @Get('/get-next-messages')
    @ApiBody({ type: CreateMessageDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async getNextMessage(@Query() query: GetMessagesDto): Promise<Messages[]> {
        return await this.messagesService.getNextMessage(query);
    }

    @ApiOperation({
        summary: 'Получение предыдущие для определенного location',
    })
    @Get('/get-previous-messages')
    @ApiBody({ type: CreateMessageDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async getPreviousMessage(@Query() query: GetMessagesDto): Promise<Messages[]> {
        return await this.messagesService.getPreviousMessage(query);
    }

    @ApiOperation({
        summary: 'Получение количества всех сообщений для определенного location',
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
    async getCountNoReadMessages(@Query() query: EndMessageDto): Promise<number> {
        return await this.messagesService.getCountNoReadMessages(query);
    }

    @ApiOperation({
        summary: 'Получение id последнего прочитанного сообщения для определенного location',
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
        return await this.messagesService.getEndReadMessagesId(query);
    }

    @ApiOperation({
        summary: 'Устанавливает последнее прочитанное сообщение для определенного location',
    })
    @Post('/set-end-read-messages-id')
    @ApiBody({ type: EndReadMessageDto })
    @UseGuards(JwtAuthGuard)
    async setEndReadMessagesId(@Body() dto: EndReadMessageDto) {
        return await this.messagesService.setEndReadMessagesId(dto);
    }

    @ApiOperation({
        summary: 'Получение сообщения по его Id',
    })
    @Get('/get-message-from-id')
    @ApiBody({ type: Number })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Данные получены',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    async getMessageFromId(@Query() query: { id_message: number }) {
        return await this.messagesService.getMessageFromId(query.id_message);
    }

    @ApiOperation({ summary: 'Блокировка сообщений' })
    @Post('/blocked-message')
    @ApiBody({ type: BlockedMessagesDto })
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
    async blockedMessages(@Body() dto: BlockedMessagesDto): Promise<string> {
        return await this.messagesService.blockedMessages(dto);
    }
}
