import { Files } from '@app/models/models/files/files.model';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { Express } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { Buffer } from 'buffer';

@Injectable()
export class FilesService {

    constructor(
        @InjectModel(Files) private readonly filesRepository: typeof Files,
    ) {}

    /**
   * Получение всех сообщений.
   * @param {any} dto - DTO для списка сообщений сообщения. 
   * @returns AddRoleDto - Данные роли.Express.Multer.File
   */
    async saveFile(file: Express.Multer.File): Promise<Files> {

        try {
            const buf1 = Buffer.from(file.buffer);
            const fileExtention = file.originalname.split('.').pop()
            const fileNameUuid = uuid.v4() + `.${fileExtention}`
            const filePath = path.resolve(__dirname, '..', 'static')
            if(!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true})
            }
            fs.writeFileSync(path.join(filePath, fileNameUuid), buf1)
            const response = await this.filesRepository.create({fileName: file.originalname, fileNameUuid})
            return response
        } catch (e){
            console.log(e)
            throw new RpcException(new InternalServerErrorException('Произошла ошибка при записи файла'));

        }

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
