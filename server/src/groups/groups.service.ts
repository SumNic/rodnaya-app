import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Order } from 'src/common/constants/order';
import { BlockedMessagesDto } from 'src/common/dtos/blocked-messages.dto';
import { CreateGroupDto } from 'src/common/dtos/create-group.dto';
import { CreatePostToChatDto } from 'src/common/dtos/create-post-to-chat.dto';
import { GetGroupsDto } from 'src/common/dtos/get-groups.dto';
import { GetPostsGroupDto } from 'src/common/dtos/get-posts-group.dto';
import { NewPostToChat } from 'src/common/dtos/new-post-to-chat.dto';
import { ChatGroup } from 'src/common/models/groups/chatGroups.model';
import { Group } from 'src/common/models/groups/groups.model';
import { LastReadPostChat } from 'src/common/models/groups/lastReadPostChat.model';
import { Residency } from 'src/common/models/users/residency.model';
import { User } from 'src/common/models/users/user.model';
import { AuthenticatedRequest } from 'src/common/types/types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GroupsService {
    constructor(
        @InjectModel(Group) private readonly groupsRepository: typeof Group,
        @InjectModel(ChatGroup) private readonly chatGroupRepository: typeof ChatGroup,
        @InjectModel(ChatGroup) private readonly lastReadPostChatRepository: typeof LastReadPostChat,
        private usersService: UsersService,
        // private readonly configService: ConfigService,
    ) {}

    async createGroup(req: AuthenticatedRequest, dto: CreateGroupDto): Promise<Group> {
        //TODO сделать проверку, чтобы было не больше 3 групп в данной локации
        try {
            const user = await this.usersService.getUserWithModel(req.user.id, [
                { model: Residency },
                { model: Group, as: 'userGroups' },
                { model: Group, as: 'adminGroups' },
            ]);

            if (user) {
                const group = await this.groupsRepository.create({
                    name: dto.groupName,
                    task: dto.groupTask,
                    userId: req.user.id,
                    [dto.location]: user.residency[dto.location] || 'Земля',
                });

                await group.$add('users', [user.id]);
                await group.$add('admins', [user.id]);

                const updatedGroup = await this.groupsRepository.findByPk(group.id, {
                    include: [
                        { model: User, as: 'users' },
                        { model: User, as: 'admins' },
                    ],
                });

                return updatedGroup;
            }

            throw new HttpException('Группа не была создана', HttpStatus.FORBIDDEN);
        } catch (err) {
            throw new HttpException(err?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllGroups(req: AuthenticatedRequest, dto: GetGroupsDto): Promise<Group[]> {
        try {
            const user = await this.usersService.getUserWithModel(req.user.id, [
                { model: Residency },
                { model: Group, as: 'userGroups' },
                { model: Group, as: 'adminGroups' },
            ]);

            if (user) {
                const groups = await this.groupsRepository.findAll({
                    where: {
                        [dto.location]: user.residency[dto.location] || 'Земля',
                        blocked: false,
                    },
                    include: { all: true },
                });

                return groups;
            }

            throw new HttpException('Ошибка при получении групп', HttpStatus.FORBIDDEN);
        } catch (err) {
            throw new HttpException(`Ошибка в getAllGroups: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getGroupFromId(id: number): Promise<Group> {
        try {
            return await this.groupsRepository.findOne({ where: { id, blocked: false }, include: { all: true } });
        } catch (err) {
            throw new HttpException(`Ошибка в getGroupsFromId: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllChatPosts(req: AuthenticatedRequest, dto: GetPostsGroupDto): Promise<ChatGroup[]> {
        try {
            const user = await this.usersService.getUserWithModel(req.user.id, [{ model: LastReadPostChat }]);

            const endReadPostId = user.lastReadPostChat.find((elem) => elem.group_id === +dto.groupId)?.lastReadPostId;
            // if (!endReadPostId) {

            // }

            const countMessage = await this.getCountPosts(+dto.groupId, endReadPostId);

            const standartLimit = 20; // Количество записей на страницу
            const offset =
                +dto.pageNumber > 0
                    ? countMessage - standartLimit + (+dto.pageNumber - 1) * standartLimit
                    : countMessage - standartLimit + +dto.pageNumber * standartLimit; // Пропускаем записи для нужной страницы

            const limit = offset < 0 ? offset + standartLimit : standartLimit;

            if (user && offset + standartLimit >= 0 && countMessage) {
                const { rows } = await this.chatGroupRepository.findAndCountAll({
                    where: {
                        groupId: +dto.groupId,
                        blocked: false,
                    },
                    include: { all: true },
                    order: [['id', Order.ASC]],
                    offset: offset < 0 ? 0 : offset,
                    limit,
                });
                console.log(rows, 'rows 123');
                return rows;
            }
            // return [new Messages()];
        } catch (err) {
            throw new HttpException(`Ошибка в getAllChatPosts: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getCountPosts(groupId: number, endReadPostId: number | undefined): Promise<number> {
        try {
            const whereClause: any = {
                groupId,
                blocked: false,
            };

            // Добавляем условие только если endReadPostId определено
            if (endReadPostId !== undefined) {
                whereClause.id = {
                    [Op.lte]: endReadPostId,
                };
            }

            const { count } = await this.chatGroupRepository.findAndCountAll({
                where: whereClause,
            });
            return count;
        } catch (err) {
            throw new HttpException(`Ошибка в getCountPosts: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async addMessage(req: AuthenticatedRequest, dto: CreatePostToChatDto): Promise<NewPostToChat> {
        try {
            const user = await this.usersService.getUserWithModel(req.user.id, [{ model: Residency }]);

            const { form } = dto;
            const { message, files, video } = form;

            if (user) {
                const messagesChat = await this.chatGroupRepository.create({
                    groupId: dto.groupId,
                    location: dto.location,
                    message,
                    video,
                });
                await user.$add('messagesChat', messagesChat);
                files.length &&
                    files.map((file) => {
                        messagesChat.$add('file', file.id);
                    });

                // const DATA = {
                //     v: this.configService.get<string>('VK_VERSION'),
                //     access_token: this.configService.get<string>('VK_ACCESS_TOKEN'),
                //     client_url: this.configService.get<string>('CLIENT_URL'),
                // };

                // const usersByResidence = this.usersService.getUsersByResidence(locationUser);
                // const peer_ids = (await usersByResidence).map((user) => user.vk_id);

                // const params = new URLSearchParams();
                // params.append('v', DATA.v);
                // params.append('access_token', DATA.access_token);
                // params.append('peer_ids', `${peer_ids.join(',')}`);
                // params.append('random_id', '0');
                // params.append(
                //     'message',
                //     `Отправитель: ${user.first_name} ${user.last_name} \nСообщение: ${message.message} \nПерейти к сообщениям: ${DATA.client_url}/messages/${dto.location}`,
                // );

                // const response = await fetch('https://api.vk.ru/method/messages.send', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/x-www-form-urlencoded',
                //     },
                //     body: params.toString(),
                // });

                // const data = await response.json();
                // console.log('Успешно отправлено', data);

                return {
                    groupId: dto.groupId,
                    messagesChat,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    photo_50: user.photo_50,
                };
            }

            throw new HttpException('Сообщение не было отправлено', HttpStatus.FORBIDDEN);
        } catch (err) {
            throw new HttpException(err?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async joinTheGroup(req: AuthenticatedRequest, id: number) {
        try {
            const group = await this.groupsRepository.findByPk(id, {
                include: [{ model: User, as: 'users' }],
            });
            console.log(group, 'group 123');

            await group.$add('users', [req.user.id]);
        } catch (err) {
            throw new HttpException(`Ошибка в getCountNoReadMessages: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async leaveTheGroup(req: AuthenticatedRequest, id: number) {
        try {
            const group = await this.groupsRepository.findByPk(id, {
                include: [{ model: User, as: 'users' }],
            });
            console.log(group, 'group 123');

            await group.$remove('users', [req.user.id]);
        } catch (err) {
            throw new HttpException(`Ошибка в getCountNoReadMessages: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getPostGroupFromId(id: number): Promise<ChatGroup> {
        try {
            const message = await this.chatGroupRepository.findByPk(id);
            return message;
        } catch (err) {
            throw new HttpException(`Ошибка в getPostGroupFromId: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async blockedPostGroup(dto: BlockedMessagesDto): Promise<string> {
        try {
            const foulMessage = await this.chatGroupRepository.findByPk(dto.id_message);
            if (dto.selectedActionIndex === 1 && foulMessage) {
                foulMessage.blocked = true;
                foulMessage.save();
                return 'Сообщение заблокировано';
            }
            if (dto.selectedActionIndex === 2 && foulMessage) {
                const userMessages = await this.chatGroupRepository.findAll({
                    where: {
                        userId: foulMessage.userId,
                    },
                });

                // Заблокировать все сообщения
                for (const message of userMessages) {
                    message.blocked = true;
                    await message.save();
                }

                return 'Все сообщения пользователя в группах заблокированы';
            }
        } catch (err) {
            throw new HttpException(`Ошибка в blockedMessages: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
