import { User } from '@app/models';
import { CreateMessageDto } from '@app/models/dtos/create-message.dto';
import { Messages } from '@app/models/models/messages/messages.model';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { GetMessagesDto } from '@app/models/dtos/get-messages.dto';
import { RpcException } from '@nestjs/microservices';
import { Order } from '@app/common';
import { CreateResidencyDto } from '@app/models/dtos/create-residency.dto';
import { EndReadMessage } from '@app/models/models/messages/endReadMessage.model';

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

        if (user && user.secret.secret === dto.secret) {
            const { count, rows } =
                await this.messagesRepository.findAndCountAll({
                    where: {
                        location: user.residency[`${dto.location}`]
                            ? user.residency[`${dto.location}`]
                            : 'Земля',
                        blocked: false,
                    },
                    include: { all: true },
                    order: [['id', Order.ASC]],
                    offset: 0,
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
            console.log(allCountMessages, 'allCountMessages')
            const allReadMessages = await this.endReadMessageRepository.findOne({
                where: {
                    user_id: user.id,
                    location: dto.location,
                },
            });

            return allCountMessages - allReadMessages.endMessage
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
        const [endReadMessages] =
            await this.endReadMessageRepository.findOrCreate({
                where: { user_id: id, location },
            });

        endReadMessages.endMessage = countMessagesInLocation;
        endReadMessages.save();

        return endReadMessages;
    }
}
