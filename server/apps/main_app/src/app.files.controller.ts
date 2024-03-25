import { JwtAuthGuard } from '@app/common';
import { AUTH_SERVICE } from '@app/common/auth/service';
import { CreateMessageDto } from '@app/models/dtos/create-message.dto';
import {
    Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { catchError } from 'rxjs';
// import { Express } from 'express';
import { Multer } from "multer";


@Controller()
export class AppFilesController {
  constructor(
    @Inject(AUTH_SERVICE) private filesClient: ClientProxy,
    private configService: ConfigService,
    // private readonly diskStorage: diskStorage
  ) {}


  @ApiTags('Отправка сообщения')
  @ApiOperation({ summary: 'Добавление нового сообщения' })
  @Post('/upload-files')
  @ApiBody({ type: CreateMessageDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Декларация добавлена',
    // type: OutputUserAndTokens,      
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неккоректные данные',
  })
  @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FileInterceptor('file', {
  //     // storage: this.diskStorage,
  //     fileFilter: (req, file, cb) => {
  //       // const isImage = file.mimetype === 'image/png' || file.mimetype === 'image/jpeg';
  //       console.log(file)
  //       const isImage = true
  //       const validFile = isImage && file.size < 500000;
  //       console.log(validFile)
        
  //       return cb(null, validFile);
  //     },
  //   }))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesClient
      .send('saveFile', file)
      .pipe(
        catchError(async (error) => {
          return new RpcException(error) 
        }),
      )
  }
  // async addMessage(@Body() dto: any) {  
  //   return this.filesClient
  //     .send('sendMessage', dto)
  //     .pipe(
  //       catchError(async (error) => {
  //         return new RpcException(error) 
  //       }),
  //     )
  // } 
} 



