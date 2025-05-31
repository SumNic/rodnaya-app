import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { FoulSendMessageDto } from 'src/common/dtos/foul-send-message.dto';
import { FooulSendMessage } from 'src/common/models/admin/foulSendMessage.model';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(FooulSendMessage)
        private readonly adminRepository: typeof FooulSendMessage,
    ) {}

    /**
     * Сообщение о нарушении правил.
     * @param {FoulSendMessageDto} dto - DTO для сообщения.
     * @returns {string} - Данные роли.
     */
    async reportViolation(dto: FoulSendMessageDto): Promise<string> {
        try {
            const getFoulMessage = await this.adminRepository.findOne({
                where: {
                    id_cleaner: dto.id_cleaner,
                    id_foul_message: dto.id_foul_message,
                    source: dto.source,
                },
            });
            if (getFoulMessage) return 'Вы уже сообщали о нарушении! Модератор рассмотрит ваше обращение в ближайшее время.';

            const foulMessage = await this.adminRepository.create(dto);
            if (foulMessage) return 'Ваше обращение принято!';
        } catch (err) {
            throw new HttpException(`Ошибка в reportViolation: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Получить список сообщений, нарушающих правил.
     * @returns FooulSendMessage - Данные.
     */
    async getFoulMessages(): Promise<FooulSendMessage[]> {
        try {
            const getAllFoulMessages = await this.adminRepository.findAll({
                where: {
                    is_decided: false,
                },
            });
            return getAllFoulMessages;
        } catch (err) {
            throw new HttpException(`Ошибка в getFoulMessages: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async fetchCleaningIsComplete(id_foul_message: number, source: string): Promise<boolean> {
        try {
            const getFoulMessage = await this.adminRepository.findOne({
                where: {
                    id_foul_message,
                },
            });
            if (getFoulMessage) {
                getFoulMessage.is_decided = true;
                getFoulMessage.save();
                return true;
            }
            return false;
        } catch (err) {
            throw new HttpException(`Ошибка в fetchCleaningIsComplete: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
