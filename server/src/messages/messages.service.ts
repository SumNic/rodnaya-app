import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Messages } from 'src/common/models/messages/messages.model';
import { EndReadMessage } from 'src/common/models/messages/endReadMessage.model';
import { CreateMessageDto } from 'src/common/dtos/create-message.dto';
import { GetMessagesDto } from 'src/common/dtos/get-messages.dto';
import { Order } from 'src/common/constants/order';
import { EndReadMessageDto } from 'src/common/dtos/end-read-message.dto';
import { BlockedMessagesDto } from 'src/common/dtos/blocked-messages.dto';
import { UsersService } from 'src/users/users.service';
import { EndMessageDto } from 'src/common/dtos/end-message.dto';
import { EndReadMessageService } from 'src/end-read-message/end-read-message.service';
import { CreateLocationDto } from 'src/common/dtos/create-location.dto';
import { RespCountNoReadMessagesDto } from 'src/common/dtos/resp-count-no-read-messages.dto';
import { RespIdNoReadMessagesDto } from 'src/common/dtos/resp-id-no-read-messages.dto';
import { NewMessage } from 'src/common/dtos/new-message.dto';
import { Residency } from 'src/common/models/users/residency.model';
import { AuthenticatedRequest } from 'src/common/types/types';
import { DeleteMessageDto } from 'src/common/dtos/delete-message.dto';
import { ROLES } from 'src/common/constants/roles';
import { UpdateMessageDto } from 'src/common/dtos/update-message.dto';
import { NotificationsService } from 'src/queue/notifications.service';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Messages) private readonly messagesRepository: typeof Messages,
        @InjectModel(EndReadMessage) private readonly endReadMessageRepository: typeof EndReadMessage,
        private usersService: UsersService,
        private endReadMessageService: EndReadMessageService,
        private notificationsService: NotificationsService,
    ) {}

    async addMessage(req: AuthenticatedRequest, dto: CreateMessageDto): Promise<NewMessage> {
        try {
            const user = await this.usersService.getUserWithModel(req.user.id, [{ model: Residency }]);

            const { form } = dto;
            const { message, files, video } = form;

            if (user) {
                const locationUser = user.residency[`${dto.location}`] ? user.residency[`${dto.location}`] : 'Земля';
                const newMessage = await this.messagesRepository.create({
                    location: locationUser,
                    message,
                    video: video,
                });
                await user.$add('messages', newMessage);

                // Привязываем файлы (если есть)
                if (files?.length > 0) {
                    await Promise.all(files.map((file) => newMessage.$add('file', file.id)));
                }

                this.setEndReadMessagesId(user.id, { id_message: newMessage.id, location: locationUser });

                const users = await this.usersService.getUsersByResidence(locationUser);
                await this.notificationsService.addNotifications(users, newMessage.message, locationUser);

                return { message: newMessage, first_name: user.first_name, last_name: user.last_name, photo_50: user.photo_50 };
            }

            throw new HttpException('Сообщение не было отправлено', HttpStatus.FORBIDDEN);
        } catch (err) {
            console.error(err, 'error in addMessage');
            throw new HttpException(err?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Редактирует текст/видео сообщения.
     * Доступно автору сообщения или администратору.
     */
    async editMessage(user: AuthenticatedRequest['user'], dto: UpdateMessageDto): Promise<Messages> {
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
    async deleteMessage(user: AuthenticatedRequest['user'], dto: DeleteMessageDto): Promise<{ message: string }> {
        const message = await this.getMessageFromId(dto.id_message);
        if (!message) {
            throw new HttpException('Сообщение не найдено', HttpStatus.NOT_FOUND);
        }
        const isAdmin = user.roles?.includes(ROLES.ADMIN);
        if (message.userId !== user.id && !isAdmin) {
            throw new HttpException('Недостаточно прав', HttpStatus.FORBIDDEN);
        }
        await this.messagesRepository.destroy({ where: { id: dto.id_message } });
        return { message: 'Сообщение удалено' };
    }

    async getAllMessage(dto: GetMessagesDto): Promise<Messages[]> {
        try {
            const user = await this.usersService.getUserWithModel(+dto.id, [{ model: Residency }]);
            const location = user.residency[`${dto.location}`] ? user.residency[`${dto.location}`] : 'Земля';

            const endReadMessagesId = await this.getEndReadMessagesId({
                id: `${dto.id}`,
                secret: dto.secret,
                residency: { [dto.location]: location },
            });

            const endReadMessagesIdForLocation = endReadMessagesId.filter((elem) => elem.location === location);

            const end_id = endReadMessagesIdForLocation[0].id;

            const countMessage = await this.getCountMessageFromId(end_id, location);

            const standartLimit = 20; // Количество записей на страницу
            const offset =
                +dto.pageNumber > 0
                    ? countMessage - standartLimit + (+dto.pageNumber - 1) * standartLimit
                    : countMessage - standartLimit + +dto.pageNumber * standartLimit; // Пропускаем записи для нужной страницы

            const limit = offset < 0 ? offset + standartLimit : standartLimit;

            if (user && user.secret === dto.secret && offset + standartLimit >= 0 && countMessage) {
                const { rows } = await this.messagesRepository.findAndCountAll({
                    where: {
                        location,
                        blocked: false,
                    },
                    include: { all: true },
                    order: [['id', Order.ASC]],
                    offset: offset < 0 ? 0 : offset,
                    limit,
                });
                return rows;
            }
        } catch (err) {
            throw new HttpException(`Ошибка в getAllMessage: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getCountNoReadMessages(dto: EndMessageDto): Promise<RespCountNoReadMessagesDto[]> {
        try {
            const user = await this.usersService.getUserWithModel(+dto.id, [{ model: Residency }]);

            if (user && user.secret === dto.secret) {
                const residencyKeys = Object.keys(dto.residency) as (keyof CreateLocationDto)[];
                // Итерация по ключам объекта LocationUser
                const messageCountsPromises = residencyKeys.map(async (key) => {
                    const value = dto.residency[key];
                    const allCountMessages = await this.endReadMessageService.getCountMessage(value);
                    const allReadMessages = await this.endReadMessageRepository.findOne({
                        where: {
                            user_id: user.id,
                            location: value,
                        },
                    });
                    const count = allCountMessages - (allReadMessages?.endMessage || 0);
                    return { location: value, count };
                });
                // Ждем завершения всех операций
                const result = await Promise.all(messageCountsPromises);
                return result.reverse();
            }
        } catch (err) {
            throw new HttpException(`Ошибка в getCountNoReadMessages: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getEndReadMessagesId(dto: EndMessageDto): Promise<RespIdNoReadMessagesDto[]> {
        try {
            const user = await this.usersService.getUserWithModel(+dto.id, [{ model: Residency }]);

            if (user && user.secret === dto.secret) {
                const residencyKeys = Object.keys(dto.residency) as (keyof CreateLocationDto)[];
                // Итерация по ключам объекта LocationUser
                const messageEndReadIdPromises = residencyKeys.map(async (key) => {
                    const value = dto.residency[key];
                    const endReadMessagesId = await this.endReadMessageRepository.findOne({
                        where: {
                            user_id: user.id,
                            location: value,
                        },
                    });
                    const id = endReadMessagesId.endMessageId;
                    return { location: value, id };
                });
                // Ждем завершения всех операций
                const result = await Promise.all(messageEndReadIdPromises);
                return result.reverse();

                // const endReadMessagesId = await this.endReadMessageRepository.findOne({
                //     where: {
                //         user_id: user.id,
                //         location: dto.location,
                //     },
                // });

                // return endReadMessagesId.endMessageId;
            }
        } catch (err) {
            throw new HttpException(`Ошибка в getEndReadMessagesId: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getCountMessageFromId(end_id: number, location: string): Promise<number> {
        try {
            // собираем базовые фильтры
            const where: Record<string, any> = { location, blocked: false };

            // если end_id ≠ 0, добавляем условие по id
            if (end_id !== 0) {
                where.id = { [Op.lte]: end_id };
            }

            // один вызов вместо двух
            const { count } = await this.messagesRepository.findAndCountAll({ where });
            return count;
        } catch (err) {
            throw new HttpException(`Ошибка в getCountMessageFromId: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async setEndReadMessagesId(user_id: number, dto: EndReadMessageDto) {
        try {
            const endReadMessages = await this.endReadMessageRepository.findOne({
                where: { user_id, location: dto.location },
            });
            const countMessages = await this.getCountMessageFromId(dto.id_message, dto.location);
            endReadMessages.endMessage = countMessages;
            endReadMessages.endMessageId = dto.id_message;
            await endReadMessages.save();
            return endReadMessages;
        } catch (err) {
            throw new HttpException(`Ошибка в setEndReadMessagesId: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getMessageFromId(id: number): Promise<Messages> {
        try {
            const message = await this.messagesRepository.findByPk(id);
            return message;
        } catch (err) {
            throw new HttpException(`Ошибка в getMessageFromId: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async blockedMessages(dto: BlockedMessagesDto): Promise<string> {
        try {
            const foulMessage = await this.messagesRepository.findByPk(dto.id_message);
            if (dto.selectedActionIndex === 1 && foulMessage) {
                foulMessage.blocked = true;
                foulMessage.save();
                return 'Сообщение заблокировано';
            }
            if (dto.selectedActionIndex === 2 && foulMessage) {
                const userMessages = await this.messagesRepository.findAll({
                    where: {
                        userId: foulMessage.userId,
                    },
                });

                // Заблокировать все сообщения
                for (const message of userMessages) {
                    message.blocked = true;
                    await message.save();
                }

                return 'Все сообщения пользователя заблокированы';
            }
        } catch (err) {
            throw new HttpException(`Ошибка в blockedMessages: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
