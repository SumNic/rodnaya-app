import { FoulSendMessageDto } from '@app/models/dtos/foul-send-message.dto';
import { FooulSendMessage } from '@app/models/models/admin/foulSendMessage.model';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(FooulSendMessage)
        private readonly adminRepository: typeof FooulSendMessage,
        // private usersService: UsersService,
    ) {}

    /**
     * Добавить новое сообщение.
     * @param {any} dto - DTO для добавления сообщения.
     * @returns AddRoleDto - Данные роли.
     */
    async reportViolation(dto: FoulSendMessageDto): Promise<string> {
        try {
            const foulMessage = await this.adminRepository.create(dto);
            if (foulMessage) return 'Ваше обращение принято!'
        } catch (err) {
            throw new RpcException(new InternalServerErrorException(`Ошибка при отправке: ${err}`));
        }
    }
}
