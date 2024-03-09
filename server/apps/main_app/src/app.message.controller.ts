import { JwtAuthGuard, ROLES } from '@app/common';
import { Roles } from '@app/common/auth/roles-auth.decorator';
import { RolesGuard } from '@app/common/auth/roles.guard';
import { AUTH_SERVICE } from '@app/common/auth/service';
import { MESSAGES_SERVICE, USERS_SERVICE } from '@app/common/constants/services';
import {
  AddRoleDto,
  OutputJwtTokens,
} from '@app/models';
import { CreateRegistrationDto } from '@app/models/dtos/create-registration.dto';
import { CreateResidencyDto } from '@app/models/dtos/create-residency.dto';
import { LogoutUserDto } from '@app/models/dtos/logout-user.dto';
import { OutputUserAndTokens } from '@app/models/dtos/output-user-and-tokens.dto';
import { UuidDevice } from '@app/models/dtos/uuid-device.dto';
import { VkLoginSdkDto } from '@app/models/dtos/vk-login-sdk.dto';
import {
    BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { catchError, tap, throwError } from 'rxjs';

@Controller()
export class AppMessagesController {
  constructor(
    @Inject(MESSAGES_SERVICE) private messagesClient: ClientProxy,
    private configService: ConfigService,
  ) {}


  @ApiTags('Отправка сообщения')
  @ApiOperation({ summary: 'Добавление нового сообщения' })
  @Post('/send-message')
  // @ApiBody({ type: CreateRegistrationDto })
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
  async addDeclaration(@Body() dto: any) {
    console.log(dto)
    return this.messagesClient
      .send('sendMessage', dto)
      .pipe(
        catchError(async (error) => {
          return new RpcException(error)
        }),
      )
  }

} 



