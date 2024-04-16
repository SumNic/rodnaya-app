import { JwtAuthGuard } from '@app/common';
import { AUTH_SERVICE } from '@app/common/auth/service';
import { CreateMessageDto } from '@app/models/dtos/create-message.dto';
import {
  BadRequestException,
  Controller,
  HttpStatus,
  Inject,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { catchError } from 'rxjs';

@Controller()
export class AppFilesController {
  constructor(
    @Inject(AUTH_SERVICE) private filesClient: ClientProxy,
  ) {}


  @ApiTags('Загрузка файла')
  @ApiOperation({ summary: 'Добавление нового файла' })
  @Post('/upload-files')
  @ApiBody({ type: CreateMessageDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Файл загружен'  
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неккоректные данные',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if(file.size > 20000000) return new RpcException(new BadRequestException('Размер файла должен быть не более 20мб'))
    const arrTypeFile = [
      'image/jpg', 
      'image/png', 
      'image/jpeg', 
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text',
      ]
    // console.log(file.mimetype, 'file.mimetype')
    const isType = arrTypeFile.reduce((accum: number, type: string) => {
      if(file.mimetype === type) {
        return accum + 1
      }
      return accum
    }, 0)
    // if(!isType) return new RpcException(new BadRequestException('Допустимы расширения: jpg, png, jpeg, pdf, doc, rtf, odt'))
    return this.filesClient
      .send('saveFile', file)
      .pipe(
        catchError(async (error) => {
          return new RpcException(error) 
        }),
      )
  }
} 



