import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';
import { Files } from 'src/common/models/files/files.model';

@Injectable()
export class FilesService {
    constructor(@InjectModel(Files) private readonly filesRepository: typeof Files) {}
    
    async saveFile(file: Express.Multer.File): Promise<Files> {
        try {
            const buf1 = Buffer.from(file.buffer);
            const fileExtention = file.originalname.split('.').pop();
            const fileNameUuid = uuidv4() + `.${fileExtention}`;
            const filePath = path.resolve(__dirname, '..', 'static');
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }
            fs.writeFileSync(path.join(filePath, fileNameUuid), buf1);
            const response = await this.filesRepository.create({ fileName: file.originalname, fileNameUuid });
            return response;
        } catch (err) {
            throw new HttpException(`Ошибка в setNewEndReadMessages: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
