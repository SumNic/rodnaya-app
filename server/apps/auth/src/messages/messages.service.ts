import { User } from '@app/models';
import { CreateMessageDto } from '@app/models/dtos/create-message.dto';
import { Messages } from '@app/models/models/messages/messages.model';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { GetMessagesDto } from '@app/models/dtos/get-messages.dto';
import { RpcException } from '@nestjs/microservices';
import { Order } from '@app/common';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Messages) private readonly messagesRepository: typeof Messages,
            private usersService: UsersService,
    ) {}
    
    /**
   * Добавить новое сообщение.
   * @param {any} dto - DTO для добавления сообщения.
   * @returns AddRoleDto - Данные роли.
   */
    async addMessage(dto: CreateMessageDto): Promise<number> {

        const user = await this.usersService.getUser(dto.id_user)        

        if (user && user.secret.secret === dto.secret) {
            const message = await this.messagesRepository.create(
                {
                    location: user.residency[`${dto.location}`] ? user.residency[`${dto.location}`] : 'Земля' , 
                    message: dto.form.message
                })
            await user.$add('messages', message);
            const arrFileId = JSON.parse(dto.form.files)
            arrFileId.map((fileId: number) => {
                message.$add('file', fileId)
                })
            return message.id
        }

        throw new RpcException(
          new InternalServerErrorException('Сообщение не было отправлено'),
        );
    }

    /**
   * Получение всех сообщений.
   * @param {any} dto - DTO для списка сообщений сообщения.
   * @returns AddRoleDto - Данные роли.
   */
    async getAllMessage(dto: GetMessagesDto): Promise<Messages[]> {

        const user = await this.usersService.getUser(dto.id_user)        

        if (user && user.secret.secret === dto.secret) {
            const messages = await this.messagesRepository.findAll(
                {where: 
                    {
                        location: user.residency[`${dto.location}`] ? user.residency[`${dto.location}`] : 'Земля' , 
                        blocked: false
                    },
                include: { all: true },
                order:[['id', Order.ASC]]
            })
            return messages
        }

        throw new RpcException(
          new InternalServerErrorException('Произошла ошибка на сервере. Повторите попытку позже.'),
        );
    }
}
