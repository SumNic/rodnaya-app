import { Controller, Get, HttpException, HttpStatus, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Files } from 'src/common/models/files/files.model';
import { FilesService } from 'src/files/files.service';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@Controller('api')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @ApiTags('Загрузка файла')
    @ApiOperation({ summary: 'Добавление нового файла' })
    @Post('/upload-files')
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Файл загружен',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<Files | Error> {
        if (file.size > 20000000) throw new HttpException('Размер файла должен быть не более 20мб', HttpStatus.BAD_REQUEST);
        const arrTypeFile = [
            'image/jpg',
            'image/png',
            'image/jpeg',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.oasis.opendocument.text',
        ];
        const isType = arrTypeFile.reduce((accum: number, type: string) => {
            if (file.mimetype === type) {
                return accum + 1;
            }
            return accum;
        }, 0);
        if (!isType) throw new HttpException('Допустимы расширения: jpg, png, jpeg, pdf, doc, rtf, odt', HttpStatus.BAD_REQUEST);
        return await this.filesService.saveFile(file);
    }

    @Get('file/:filename')
    getFile(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = path.resolve(__dirname, '..', '..', 'static', filename);
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        } else {
            return res.status(404).send('File not found');
        }
    }
}
