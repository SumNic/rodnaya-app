import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BlockedMessagesDto } from 'src/common/dtos/blocked-messages.dto';
import { CreateMessageDto } from 'src/common/dtos/create-message.dto';
import { CreatePublicationDto } from 'src/common/dtos/create-publication.dto';
import { GetPublicationsDto } from 'src/common/dtos/get-publications.dto';
import { Publications } from 'src/common/models/publications/publications.model';
import { AuthenticatedRequest } from 'src/common/types/types';
import { PublicationsGateway } from 'src/publications/publications.gateway';
import { PublicationsService } from 'src/publications/publications.service';

@ApiTags('Публикации')
@Controller('api')
export class PublicationsController {
    constructor(
        private readonly publicationsService: PublicationsService,
        private readonly publicationsGateway: PublicationsGateway,
    ) {}

    @ApiOperation({ summary: 'Добавление нового сообщения' })
    @Post('/send-publication')
    @ApiBody({ type: CreatePublicationDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Сообщение добавлено',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async addPublication(@Req() req: AuthenticatedRequest, @Body() dto: CreatePublicationDto) {
        const response = await this.publicationsService.addPublication(req, dto);
        if (response) {
            this.publicationsGateway.sendPublicationWebSocket('new_publication', {
                ...dto,
                id_user: req.user.id,
                id_publication: response.message.id,
                resydency: { locality: response.message.locality, region: response.message.region, country: response.message.country },
                first_name: response.first_name,
                last_name: response.last_name,
                photo_50: response.photo_50,
                createdAt: response.message.createdAt,
            });
        }
    }

    @ApiOperation({
        summary: 'Получение всех сообщений для определенного location',
    })
    @Get('/get-all-publications')
    @ApiResponse({ status: 200, description: 'Список публикаций', type: [Publications] })
    @ApiResponse({ status: 400, description: 'Некорректные данные' })
    async getAllPublication(@Query() query: GetPublicationsDto): Promise<Publications[]> {
        return await this.publicationsService.getAllPublication(query);
    }

    @ApiOperation({ summary: 'Получение публикации по id' })
    @Get('/get-publication/:id')
    @ApiParam({
        name: 'id',
        example: 1,
        required: true,
        description: 'Идентификатор публикации в базе данных',
        type: Number,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Публикация получена',
        // type: OutputUserAndTokens,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    async getDeclaration(@Param('id') id: number): Promise<Publications> {
        return await this.publicationsService.getPublicationFromId(id);
    }

    @ApiOperation({
        summary: 'Получение всех сообщений для определенного пользователя',
    })
    @Get('/get-user-publications')
    @ApiBody({ type: CreateMessageDto })
    @ApiResponse({
        status: HttpStatus.OK,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    async getUserPublication(@Query() query: { id: string; pageNumber: string }): Promise<Publications[]> {
        return await this.publicationsService.getUserPublication(query);
    }

    @ApiOperation({ summary: 'Блокировка сообщений' })
    @Post('/blocked-publication')
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
    async blockedPublications(@Body() dto: BlockedMessagesDto): Promise<string> {
        return await this.publicationsService.blockedPublications(dto);
    }
}
