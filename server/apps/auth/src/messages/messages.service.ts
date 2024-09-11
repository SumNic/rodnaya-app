import { CreateMessageDto } from '@app/models/dtos/create-message.dto';
import { Messages } from '@app/models/models/messages/messages.model';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { GetMessagesDto } from '@app/models/dtos/get-messages.dto';
import { RpcException } from '@nestjs/microservices';
import { Order } from '@app/common';
import { EndReadMessage } from '@app/models/models/messages/endReadMessage.model';
import { EndReadMessageDto } from '@app/models/dtos/end-read-message.dto';
import { Op } from 'sequelize';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Messages)
        private readonly messagesRepository: typeof Messages,
        @InjectModel(EndReadMessage)
        private readonly endReadMessageRepository: typeof EndReadMessage,
        private usersService: UsersService,
    ) {}

    /**
     * Добавить новое сообщение.
     * @param {any} dto - DTO для добавления сообщения.
     * @returns AddRoleDto - Данные роли.
     */
    async addMessage(dto: CreateMessageDto): Promise<number> {
        const user = await this.usersService.getUser(dto.id_user);

        if (user && user.secret.secret === dto.secret) {
            const message = await this.messagesRepository.create({
                location: user.residency[`${dto.location}`]
                    ? user.residency[`${dto.location}`]
                    : 'Земля',
                message: dto.form.message,
            });
            await user.$add('messages', message);
            const arrFileId = JSON.parse(dto.form.files);
            arrFileId.map((fileId: number) => {
                message.$add('file', fileId);
            });
            return message.id;
        }

        throw new RpcException(
            new InternalServerErrorException('Сообщение не было отправлено'),
        );
    }

    /**
     * Получение всех сообщений.
     * @param {any} dto - DTO для списка сообщений сообщения.
     * @returns Messages[] - Массив сообщений.
     */
    async getAllMessage(dto: GetMessagesDto): Promise<Messages[]> {
        const user = await this.usersService.getUser(+dto.id);

        const endReadMessagesId = await this.getEndReadMessagesId({
            ...dto,
            location: user.residency[`${dto.location}`]
                ? user.residency[`${dto.location}`]
                : 'Земля',
        });

        const countMessage = await this.getCountMessageFromId(
            +dto.start_message_id !== -1
                ? +dto.start_message_id
                : endReadMessagesId,
            user.residency[`${dto.location}`]
                ? user.residency[`${dto.location}`]
                : 'Земля',
        );

        if (
            user &&
            user.secret.secret === dto.secret &&
            endReadMessagesId &&
            countMessage
        ) {
            const { rows } = await this.messagesRepository.findAndCountAll({
                where: {
                    location: user.residency[`${dto.location}`]
                        ? user.residency[`${dto.location}`]
                        : 'Земля',
                    blocked: false,
                },
                include: { all: true },
                order: [['id', Order.ASC]],
                offset: countMessage < 20 ? 0 : countMessage - 20,
                limit: 20,
            });
            return rows;
        }

        throw new RpcException(
            new InternalServerErrorException(
                'Произошла ошибка на сервере. Повторите попытку позже.',
            ),
        );
    }

    /**
     * Получение количества сообщений.
     * @param {any} dto - DTO для списка сообщений сообщения.
     * @returns number - количество сообщений.
     */
    async getCountNoReadMessages(dto: GetMessagesDto): Promise<number> {
        const user = await this.usersService.getUser(+dto.id);

        if (user && user.secret.secret === dto.secret) {
            const allCountMessages = await this.getCountMessage(dto.location);
            const allReadMessages = await this.endReadMessageRepository.findOne(
                {
                    where: {
                        user_id: user.id,
                        location: dto.location,
                    },
                },
            );

            return allCountMessages - allReadMessages.endMessage;
        }

        throw new RpcException(
            new InternalServerErrorException(
                'Произошла ошибка на сервере. Повторите попытку позже.',
            ),
        );
    }

    /**
     * Получение id последнего прочитанного сообщения.
     * @param {any} dto - DTO для списка сообщений сообщения.
     * @returns number - количество сообщений.
     */
    async getEndReadMessagesId(dto: GetMessagesDto): Promise<number> {
        const user = await this.usersService.getUser(+dto.id);

        if (user && user.secret.secret === dto.secret) {
            const endReadMessagesId =
                await this.endReadMessageRepository.findOne({
                    where: {
                        user_id: user.id,
                        location: dto.location,
                    },
                });

            return endReadMessagesId.endMessageId;
        }

        throw new RpcException(
            new InternalServerErrorException(
                'Произошла ошибка на сервере. Повторите попытку позже.',
            ),
        );
    }

    /**
     * Получение количества сообщений.
     * @param {any} dto - DTO для списка сообщений сообщения.
     * @returns number - количество сообщений.
     */
    async getCountMessage(location: string): Promise<number> {
        const { count } = await this.messagesRepository.findAndCountAll({
            where: {
                location: location,
                blocked: false,
            },
        });
        return count;
    }

    async getCountMessageFromId(
        end_id: number,
        location: string,
    ): Promise<number> {
        const { count } = await this.messagesRepository.findAndCountAll({
            where: {
                id: {
                    [Op.lte]: end_id, // Используем оператор Op.lte для "меньше или равно"
                },
                location: location,
                blocked: false,
            },
        });
        return count;
    }

    async getEndMessageId(location: string): Promise<number> {
        const { rows } = await this.messagesRepository.findAndCountAll({
            where: {
                location: location,
                blocked: false,
            },
        });
        return rows?.at(-1)?.id ? rows.at(-1).id : 0;
    }

    /**
     * Назначение последних прочитанных сообщений пользователя при регистрации.
     * @param {any} dto - DTO для списка сообщений сообщения.
     * @returns number - количество сообщений.
     */
    async setEndReadMessagesId(dto: EndReadMessageDto) {
        const endReadMessages = await this.endReadMessageRepository.findOne({
            where: { user_id: dto.id_user, location: dto.location },
        });
        const countNoReadMessages = await this.getCountMessageFromId(
            dto.id_message,
            dto.location,
        );
        endReadMessages.endMessage = countNoReadMessages;
        endReadMessages.endMessageId = dto.id_message;
        endReadMessages.save();

        return endReadMessages;
    }

    /**
     * Назначение последних прочитанных сообщений пользователя при регистрации.
     * @param {any} dto - DTO для списка сообщений сообщения.
     * @returns number - количество сообщений.
     */
    async setNewEndReadMessages(
        id: number,
        location: string,
    ): Promise<EndReadMessage> {
        const countMessagesInLocation = await this.getCountMessage(location);
        const endMessageId = await this.getEndMessageId(location);
        const [endReadMessages] =
            await this.endReadMessageRepository.findOrCreate({
                where: { user_id: id, location },
            });
        endReadMessages.endMessage = countMessagesInLocation;
        endReadMessages.endMessageId = endMessageId;
        endReadMessages.save();

        return endReadMessages;
    }
}
