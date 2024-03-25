import { Files } from '@app/models/models/files/files.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Express } from 'express';

@Injectable()
export class FilesService {

    constructor(
        @InjectModel(Files) private readonly filesRepository: typeof Files,
    ) {}

    /**
   * Получение всех сообщений.
   * @param {any} dto - DTO для списка сообщений сообщения. 
   * @returns AddRoleDto - Данные роли.
   */
    async saveFile(file: Express.Multer.File): Promise<any> {

        console.log(file, 'file')
        return file

        // const user = await this.usersService.getUser(dto.id_user)        

        // if (user && user.secret.secret === dto.secret) {
        //     const messages = await this.messagesRepository.findAll(
        //         {where: 
        //             {
        //                 location: user.residency[`${dto.location}`] ? user.residency[`${dto.location}`] : 'Земля' , 
        //                 blocked: false
        //             },
        //         include: { all: true }
        //         })
        //     return messages
        // }
    }
}
