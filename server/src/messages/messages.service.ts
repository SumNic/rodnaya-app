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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Messages) private readonly messagesRepository: typeof Messages,
        @InjectModel(EndReadMessage) private readonly endReadMessageRepository: typeof EndReadMessage,
        private usersService: UsersService,
        private endReadMessageService: EndReadMessageService,
        private readonly configService: ConfigService,
    ) {}

    async addMessage(dto: CreateMessageDto): Promise<number> {
        try {
            const user = await this.usersService.getUser(dto.id_user);

            if (user && user.secret === dto.secret) {
                const locationUser = user.residency[`${dto.location}`] ? user.residency[`${dto.location}`] : 'Земля';
                const message = await this.messagesRepository.create({
                    location: locationUser,
                    message: dto.form.message,
                });
                await user.$add('messages', message);
                const arrFileId = JSON.parse(dto.form.files);
                arrFileId.map((fileId: number) => {
                    message.$add('file', fileId);
                });

                const DATA = {
                    v: this.configService.get<string>('VK_VERSION'),
                    access_token: this.configService.get<string>('VK_ACCESS_TOKEN'),
                    client_url: this.configService.get<string>('CLIENT_URL'),
                };

                const usersByResidence = this.usersService.getUsersByResidence(locationUser);
                const peer_ids = (await usersByResidence).map((user) => user.vk_id);

                const params = new URLSearchParams();
                params.append('v', DATA.v);
                params.append('access_token', DATA.access_token);
                params.append('peer_ids', `${peer_ids.join(',')}`);
                params.append('random_id', '0');
                params.append(
                    'message',
                    `Отправитель: ${user.first_name} ${user.last_name} \nСообщение: ${message.message} \nПерейти к сообщениям: ${DATA.client_url}/messages/${dto.location}`,
                );

                const response = await fetch('https://api.vk.com/method/messages.send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString(),
                });

                const data = await response.json();
                console.log('Успешно отправлено', data);

                return message.id;
            }

            throw new HttpException('Сообщение не было отправлено', HttpStatus.FORBIDDEN);
        } catch (err) {
            throw new HttpException(err?.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllMessage(dto: GetMessagesDto): Promise<Messages[]> {
        try {
            const user = await this.usersService.getUser(+dto.id);

            const endReadMessagesId = await this.getEndReadMessagesId({
                id: `${dto.id}`,
                secret: dto.secret,
                location: user.residency[`${dto.location}`] ? user.residency[`${dto.location}`] : 'Земля',
            });

            const end_id = +dto.start_message_id !== -1 ? +dto.start_message_id : endReadMessagesId;
            const location = user.residency[`${dto.location}`] ? user.residency[`${dto.location}`] : 'Земля';

            const countMessage = await this.getCountMessageFromId(end_id, location);

            if (user && user.secret === dto.secret && endReadMessagesId >= 0 && countMessage >= 0) {
                const { rows } = await this.messagesRepository.findAndCountAll({
                    where: {
                        location: user.residency[`${dto.location}`] ? user.residency[`${dto.location}`] : 'Земля',
                        blocked: false,
                    },
                    include: { all: true },
                    order: [['id', Order.ASC]],
                    offset: countMessage < 20 ? 0 : countMessage - 20,
                    limit: 20,
                });
                return rows;
            }
        } catch (err) {
            throw new HttpException(`Ошибка в getAllMessage: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getNextMessage(dto: GetMessagesDto): Promise<Messages[]> {
        try {
            const user = await this.usersService.getUser(+dto.id);

            const end_id = +dto.start_message_id;
            const location = user.residency[`${dto.location}`] ? user.residency[`${dto.location}`] : 'Земля';

            const countMessage = await this.getCountMessageFromId(end_id, location);

            if (user && user.secret === dto.secret) {
                const { rows } = await this.messagesRepository.findAndCountAll({
                    where: {
                        location: user.residency[`${dto.location}`] ? user.residency[`${dto.location}`] : 'Земля',
                        blocked: false,
                    },
                    include: { all: true },
                    order: [['id', Order.ASC]],
                    offset: countMessage,
                    limit: 20,
                });
                if (rows) return rows;
                return [];
            }
        } catch (err) {
            throw new HttpException(`Ошибка в getNextMessage: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getPreviousMessage(dto: GetMessagesDto): Promise<Messages[]> {
        try {
            const user = await this.usersService.getUser(+dto.id);

            const end_id = +dto.start_message_id;
            const location = user.residency[`${dto.location}`] ? user.residency[`${dto.location}`] : 'Земля';

            const countMessage = await this.getCountMessageFromId(end_id, location);

            if (user && user.secret === dto.secret && countMessage >= 1) {
                const { rows } = await this.messagesRepository.findAndCountAll({
                    where: {
                        location: user.residency[`${dto.location}`] ? user.residency[`${dto.location}`] : 'Земля',
                        blocked: false,
                    },
                    include: { all: true },
                    order: [['id', Order.ASC]],
                    offset: countMessage - 1 < 20 ? 0 : countMessage - 21,
                    limit: countMessage - 1 < 20 ? countMessage - 1 : 20,
                });
                return rows;
            } else if (!user && user.secret !== dto.secret && countMessage < 1) {
                return;
            }
        } catch (err) {
            throw new HttpException(`Ошибка в getPreviousMessage: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getCountNoReadMessages(dto: EndMessageDto): Promise<number> {
        try {
            const user = await this.usersService.getUser(+dto.id);

            if (user && user.secret === dto.secret) {
                const allCountMessages = await this.endReadMessageService.getCountMessage(dto.location);
                const allReadMessages = await this.endReadMessageRepository.findOne({
                    where: {
                        user_id: user.id,
                        location: dto.location,
                    },
                });
                return allCountMessages - allReadMessages.endMessage;
            }
        } catch (err) {
            throw new HttpException(`Ошибка в getCountNoReadMessages: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getEndReadMessagesId(dto: EndMessageDto): Promise<number> {
        try {
            const user = await this.usersService.getUser(+dto.id);

            if (user && user.secret === dto.secret) {
                const endReadMessagesId = await this.endReadMessageRepository.findOne({
                    where: {
                        user_id: user.id,
                        location: dto.location,
                    },
                });

                return endReadMessagesId.endMessageId;
            }
        } catch (err) {
            throw new HttpException(`Ошибка в getEndReadMessagesId: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getCountMessageFromId(end_id: number, location: string): Promise<number> {
        try {
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
        } catch (err) {
            throw new HttpException(`Ошибка в getCountMessageFromId: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async setEndReadMessagesId(dto: EndReadMessageDto) {
        try {
            const endReadMessages = await this.endReadMessageRepository.findOne({
                where: { user_id: dto.id_user, location: dto.location },
            });
            const countNoReadMessages = await this.getCountMessageFromId(dto.id_message, dto.location);
            endReadMessages.endMessage = countNoReadMessages;
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
