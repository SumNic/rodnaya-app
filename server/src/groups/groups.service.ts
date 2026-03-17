import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { Order } from 'src/common/constants/order';
import { ROLES } from 'src/common/constants/roles';
import { BlockedMessagesDto } from 'src/common/dtos/blocked-messages.dto';
import { CreateGroupDto } from 'src/common/dtos/create-group.dto';
import { CreatePostToChatDto } from 'src/common/dtos/create-post-to-chat.dto';
import { DeleteGroupMessageDto } from 'src/common/dtos/delete-group-message.dto';
import { GetGroupsDto } from 'src/common/dtos/get-groups.dto';
import { GetPostsGroupDto } from 'src/common/dtos/get-posts-group.dto';
import { GroupUnreadInfoDto } from 'src/common/dtos/group-unread-info.dto';
import { NewGroupMessage } from 'src/common/dtos/new-post-to-chat.dto';
import { UpdateGroupMessageDto } from 'src/common/dtos/update-group-message.dto';
import { GroupMessage } from 'src/common/models/groups/groupMessage';
import { Group } from 'src/common/models/groups/groups.model';
import { LastReadPostChat } from 'src/common/models/groups/lastReadPostChat.model';
import { Residency } from 'src/common/models/users/residency.model';
import { User } from 'src/common/models/users/user.model';
import { AuthenticatedRequest, Direction, LocationType } from 'src/common/types/types';
import { NotificationMessage } from 'src/queue/notifications.processor';
import { NotificationsService } from 'src/queue/notifications.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GroupsService {
    constructor(
        @InjectModel(Group) private readonly groupsRepository: typeof Group,
        @InjectModel(GroupMessage) private readonly groupMessagesRepository: typeof GroupMessage,
        @InjectModel(LastReadPostChat) private readonly lastReadPostChatRepository: typeof LastReadPostChat,
        private usersService: UsersService,
        private notificationsService: NotificationsService,
        // private readonly sequelize: Sequelize,
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
                    [dto.location]: user.residency[dto.location] || LocationType.GLOBAL,
                    location: dto.location,
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
                        [dto.location]: user.residency[dto.location] || LocationType.GLOBAL,
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

    async getAllChatPosts(userId: number, dto: GetPostsGroupDto): Promise<GroupMessage[]> {
        try {
            const groupId = dto.groupId;
            const limit = dto.limit ?? 20;

            const user = await this.usersService.getUserWithModel(userId, [{ model: LastReadPostChat }]);

            const lastRead = user.lastReadPostChat.find((r) => r.group_id === groupId);

            // 1️⃣ считаем ВСЕ сообщения в чате
            const totalCount = await this.groupMessagesRepository.count({
                where: {
                    groupId,
                    blocked: false,
                },
            });

            // 2️⃣ базовый where
            const where: any = {
                groupId,
                blocked: false,
            };

            // 🔹 ПЕРВАЯ ЗАГРУЗКА
            if (!dto.cursor) {
                const totalCount = await this.groupMessagesRepository.count({
                    where,
                });

                if (totalCount > limit && lastRead?.lastReadPostId) {
                    where.id = { [Op.lte]: lastRead.lastReadPostId };
                }

                const messages = await this.groupMessagesRepository.findAll({
                    where,
                    include: { all: true },
                    order: [['id', 'DESC']],
                    limit,
                });

                return messages.reverse();
            }

            // 🔹 ЗАГРУЗКА ВВЕРХ (старые)
            if (dto.direction === Direction.BEFORE) {
                where.id = { [Op.lt]: dto.cursor };

                const messages = await this.groupMessagesRepository.findAll({
                    where,
                    include: { all: true },
                    order: [['id', 'DESC']],
                    limit,
                });

                return messages.reverse();
            }

            // 🔹 ЗАГРУЗКА ВНИЗ (новые)
            if (dto.direction === Direction.AFTER) {
                where.id = { [Op.gt]: dto.cursor };

                return await this.groupMessagesRepository.findAll({
                    where,
                    include: { all: true },
                    order: [['id', 'ASC']],
                    limit,
                });
            }

            return [];
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

            const { count } = await this.groupMessagesRepository.findAndCountAll({
                where: whereClause,
            });
            return count;
        } catch (err) {
            throw new HttpException(`Ошибка в getCountPosts: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async addMessage(req: AuthenticatedRequest, dto: CreatePostToChatDto): Promise<NewGroupMessage> {
        try {
            const user = await this.usersService.getUserWithModel(req.user.id, [{ model: Residency }]);

            const { form } = dto;
            const { message, files, video } = form;

            if (user) {
                const messagesChat = await this.groupMessagesRepository.create({
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

                const users = await this.usersService.getUsersByGroupId(dto.groupId);
                const group = await this.getGroupFromId(dto.groupId);
                const notificationMessage: NotificationMessage = {
                    senderId: messagesChat.userId,
                    title: 'Группа',
                    body: messagesChat.message,
                };
                await this.notificationsService.addNotifications(users, notificationMessage, group.name);

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

    /**
     * Редактирует текст/видео сообщения.
     * Доступно автору сообщения или администратору.
     */
    async editMessage(user: AuthenticatedRequest['user'], dto: UpdateGroupMessageDto): Promise<GroupMessage> {
        const message = await this.getMessageFromId(dto.id_message); // из existing метода [[citation:1]]
        if (!message) {
            throw new HttpException('Сообщение не найдено', HttpStatus.NOT_FOUND);
        }
        const isAdmin = user.roles?.includes(ROLES.ADMIN);
        if (message.userId !== user.id && !isAdmin) {
            throw new HttpException('Недостаточно прав', HttpStatus.FORBIDDEN);
        }
        message.message = dto.message;
        if (dto.video !== undefined) {
            message.video = dto.video;
        }
        await message.save();
        return message;
    }

    /**
     * Удаляет сообщение.
     * Доступно автору сообщения или администратору.
     */
    async deleteMessage(user: AuthenticatedRequest['user'], dto: DeleteGroupMessageDto): Promise<{ message: string }> {
        const message = await this.getMessageFromId(dto.id_message);
        if (!message) {
            throw new HttpException('Сообщение не найдено', HttpStatus.NOT_FOUND);
        }
        const isAdmin = user.roles?.includes(ROLES.ADMIN);
        if (message.userId !== user.id && !isAdmin) {
            throw new HttpException('Недостаточно прав', HttpStatus.FORBIDDEN);
        }
        await this.groupMessagesRepository.destroy({ where: { id: dto.id_message } });
        return { message: 'Сообщение удалено' };
    }

    async getMessageFromId(id: number): Promise<GroupMessage> {
        try {
            const message = await this.groupMessagesRepository.findByPk(id);
            return message;
        } catch (err) {
            throw new HttpException(`Ошибка в getMessageFromId: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async joinTheGroup(userId: number, id: number) {
        try {
            const group = await this.groupsRepository.findByPk(id, {
                include: [{ model: User, as: 'users' }],
            });

            if (!group) {
                throw new HttpException('Группа не найдена', HttpStatus.NOT_FOUND);
            }

            await group.$add('users', [userId]);
        } catch (err) {
            throw new HttpException(`Ошибка в getCountNoReadMessages: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async leaveTheGroup(req: AuthenticatedRequest, id: number) {
        try {
            const group = await this.groupsRepository.findByPk(id, {
                include: [{ model: User, as: 'users' }],
            });

            await group.$remove('users', [req.user.id]);
        } catch (err) {
            throw new HttpException(`Ошибка в getCountNoReadMessages: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getPostGroupFromId(id: number): Promise<GroupMessage> {
        try {
            const message = await this.groupMessagesRepository.findByPk(id);
            return message;
        } catch (err) {
            throw new HttpException(`Ошибка в getPostGroupFromId: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async blockedPostGroup(dto: BlockedMessagesDto): Promise<string> {
        try {
            const foulMessage = await this.groupMessagesRepository.findByPk(dto.id_message);
            if (dto.selectedActionIndex === 1 && foulMessage) {
                foulMessage.blocked = true;
                foulMessage.save();
                return 'Сообщение заблокировано';
            }
            if (dto.selectedActionIndex === 2 && foulMessage) {
                const userMessages = await this.groupMessagesRepository.findAll({
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

    async updateLastRead(userId: number, groupId: number, lastReadPostId: number) {
        const record = await this.lastReadPostChatRepository.findOne({
            where: { userId, group_id: groupId },
        });

        if (!record) {
            await this.lastReadPostChatRepository.create({
                userId,
                group_id: groupId,
                lastReadPostId,
            });
            return;
        }

        if (record.lastReadPostId < lastReadPostId) {
            record.lastReadPostId = lastReadPostId;
            await record.save();
        }
    }

    async getUnreadInfoForUser(userId: number): Promise<GroupUnreadInfoDto[]> {
        const results = await this.groupsRepository.sequelize.query<{
            groupId: number;
            lastReadPostId: number | null;
            unreadCount: number;
            location: string;
        }>(
            `
                SELECT
                    g.location AS "location",
                    ug."groupId" AS "groupId",
                    lrp."lastReadPostId" AS "lastReadPostId",
                COUNT(gm.id) AS "unreadCount"
                FROM user_groups ug
                LEFT JOIN groups g
                ON g.id = ug."groupId"
                LEFT JOIN "lastReadPostChat" lrp
                ON lrp."userId" = ug."userId"
                AND lrp.group_id = ug."groupId"
                LEFT JOIN "groupMessages" gm
                ON gm."groupId" = ug."groupId"
                AND gm.blocked = false
                AND (
                    lrp."lastReadPostId" IS NULL
                    OR gm.id > lrp."lastReadPostId"
                )
                WHERE ug."userId" = :userId
                GROUP BY ug."groupId", lrp."lastReadPostId", g.location;
            `,
            {
                replacements: { userId },
                type: QueryTypes.SELECT,
            },
        );

        return results;
    }
}
