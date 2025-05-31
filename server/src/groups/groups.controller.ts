import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ROLES } from 'src/common/constants/roles';
import { BlockedMessagesDto } from 'src/common/dtos/blocked-messages.dto';
import { CreateGroupDto } from 'src/common/dtos/create-group.dto';
import { CreatePostToChatDto } from 'src/common/dtos/create-post-to-chat.dto';
import { GetGroupsDto } from 'src/common/dtos/get-groups.dto';
import { GetPostsGroupDto } from 'src/common/dtos/get-posts-group.dto';
import { ChatGroup } from 'src/common/models/groups/chatGroups.model';
import { Group } from 'src/common/models/groups/groups.model';
import { Messages } from 'src/common/models/messages/messages.model';
import { AuthenticatedRequest } from 'src/common/types/types';
import { GroupsGateway } from 'src/groups/groups.gateway';
import { GroupsService } from 'src/groups/groups.service';

@ApiTags('Группы')
@Controller('api')
export class GroupsController {
    constructor(
        private readonly groupsService: GroupsService,
        private readonly groupsGateway: GroupsGateway,
    ) {}

    @ApiOperation({ summary: 'Создание новой группы' })
    @Post('/create-group')
    @ApiBody({ type: CreateGroupDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Группа создана',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async createGroup(@Req() req: AuthenticatedRequest, @Body() dto: CreateGroupDto) {
        return await this.groupsService.createGroup(req, dto);
    }

    @ApiOperation({
        summary: 'Получение всех групп для определенного location',
    })
    @Get('/get-all-group')
    @ApiResponse({
        status: HttpStatus.CREATED,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async getAllPublication(@Req() req: AuthenticatedRequest, @Query() query: GetGroupsDto): Promise<Group[]> {
        return await this.groupsService.getAllGroups(req, query);
    }

    @ApiOperation({ summary: 'Получение группы по id' })
    @Get('/get-group/:id')
    @ApiParam({
        name: 'id',
        example: 1,
        required: true,
        description: 'Идентификатор группы в базе данных',
        type: Number,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Группа получена',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async getGroupFromId(@Param('id') id: number): Promise<Group> {
        return await this.groupsService.getGroupFromId(id);
    }

    @ApiOperation({
        summary: 'Получение всех сообщений для определенной группы',
    })
    @Get('/get-all-posts-group')
    @ApiBody({ type: GetPostsGroupDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async getAllChatPosts(@Req() req: AuthenticatedRequest, @Query() query: GetPostsGroupDto): Promise<ChatGroup[]> {
        return await this.groupsService.getAllChatPosts(req, query);
    }

    @ApiOperation({ summary: 'Добавление нового сообщения' })
    @Post('/send-post-to-chat')
    @ApiBody({ type: CreatePostToChatDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Сообщение добавлено',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async addMessage(@Req() req: AuthenticatedRequest, @Body() dto: CreatePostToChatDto) {
        const response = await this.groupsService.addMessage(req, dto);
        if (response) {
            this.groupsGateway.sendMessageWebSocket('new_message', {
                ...dto,
                group_id: response.groupId,
                id_message: response.messagesChat.id,
                resydency: response.messagesChat.location,
                first_name: response.first_name,
                last_name: response.last_name,
                photo_50: response.photo_50,
                createdAt: response.messagesChat.createdAt
            });
        }
    }

    @ApiOperation({
        summary: 'Вступить в группу',
    })
    @Post('/join-the-group')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Учредитель вступил в группу',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async joinTheGroup(@Req() req: AuthenticatedRequest, @Body('id') id: any) {
        console.log(id, 'id 555');
        //: Promise<number>
        return await this.groupsService.joinTheGroup(req, id);
    }

    @ApiOperation({
        summary: 'Выйти из группы',
    })
    @Post('/leave-the-group')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Учредитель вышел из группы',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async leaveTheGroup(@Req() req: AuthenticatedRequest, @Body('id') id: number) {
        console.log(id, 'id 555');
        //: Promise<number>
        return await this.groupsService.leaveTheGroup(req, id);
    }

    @ApiOperation({
        summary: 'Получение сообщения по его Id',
    })
    @Get('/get-post-group-from-id')
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
    async getPostGroupFromId(@Query() query: { id_message: number }) {
        return await this.groupsService.getPostGroupFromId(query.id_message);
    }

    @ApiOperation({ summary: 'Блокировка сообщений' })
    @Post('/blocked-post-group')
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
    async blockedPostGroup(@Body() dto: BlockedMessagesDto): Promise<string> {
        return await this.groupsService.blockedPostGroup(dto);
    }
}
