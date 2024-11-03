import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EndReadMessage } from '../common/models/messages/endReadMessage.model';
import { Op } from 'sequelize';
import { Messages } from 'src/common/models/messages/messages.model';

@Injectable()
export class EndReadMessageService {
    constructor(
        @InjectModel(EndReadMessage) private readonly endReadMessageRepository: typeof EndReadMessage,
        @InjectModel(Messages) private readonly messagesRepository: typeof Messages,
    ) {}

    async setNewEndReadMessages(user_id: number, location: string): Promise<EndReadMessage> {
        try {
            const countMessagesInLocation = await this.getCountMessage(location);
            const endMessageId = await this.getEndMessageId(location);
            const [endReadMessages] = await this.endReadMessageRepository.findOrCreate({
                where: { user_id, location },
            });
            endReadMessages.endMessage = countMessagesInLocation;
            endReadMessages.endMessageId = endMessageId;
            await endReadMessages.save();
            return endReadMessages;
        } catch (err) {
            throw new HttpException(`Ошибка в setNewEndReadMessages: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteOldLocations(id: number, locations: string[]) {
        try {
            await this.endReadMessageRepository.destroy({
                where: {
                    user_id: id,
                    location: { [Op.notIn]: locations },
                },
            });
        } catch (err) {
            throw new HttpException(`Ошибка в deleteOldLocations: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getCountMessage(location: string): Promise<number> {
        try {
            const { count } = await this.messagesRepository.findAndCountAll({
                where: {
                    location: location,
                    blocked: false,
                },
            });
            return count;
        } catch (err) {
            throw new HttpException(`Ошибка в getCountMessage: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getEndMessageId(location: string): Promise<number> {
        try {
            const { rows } = await this.messagesRepository.findAndCountAll({
                where: {
                    location: location,
                    blocked: false,
                },
            });
            return rows?.at(-1)?.id ? rows.at(-1).id : 0;
        } catch (err) {
            throw new HttpException(`Ошибка в getEndMessageId: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
