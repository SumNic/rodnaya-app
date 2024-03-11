import { User } from '@app/models';
import { CreateMessageDto } from '@app/models/dtos/create-message.dto';
import { Messages } from '@app/models/models/messages/messages.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';

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
    async addMessage(dto: CreateMessageDto): Promise<any> {

        const user = await this.usersService.getUser(dto.id_user)        

        if (user && user.secret.secret === dto.secret) {
            const message = await this.messagesRepository.create({location: user.residency[`${dto.location}`], message: dto.form.message})
            await user.$add('messages', message);
            return user
        }
        // await declaration.update({ declaration: dto.declaration })
        // const declaration = await this.declarationRepository.create(dto)
        

        // if (role && user) {
        //   await user.$remove('role', role.id);

        //   return dto;
        // }

        // throw new RpcException(
        //   new NotFoundException('Пользователь или роль не найдены'),
        // );
    }
}
