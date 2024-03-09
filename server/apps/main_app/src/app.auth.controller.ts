import { JwtAuthGuard, ROLES } from '@app/common';
import { Roles } from '@app/common/auth/roles-auth.decorator';
import { RolesGuard } from '@app/common/auth/roles.guard';
import { AUTH_SERVICE } from '@app/common/auth/service';
import {
  AddRoleDto,
  OutputJwtTokens,
} from '@app/models';
import { CreateDeclarationDto } from '@app/models/dtos/create-declaration.dto';
import { CreateRegistrationDto } from '@app/models/dtos/create-registration.dto';
import { CreateResidencyDto } from '@app/models/dtos/create-residency.dto';
import { LogoutUserDto } from '@app/models/dtos/logout-user.dto';
import { OutputUserAndTokens } from '@app/models/dtos/output-user-and-tokens.dto';
import { UpdatePersonaleDto } from '@app/models/dtos/update-personale.dto';
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
export class AppAuthController {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    private configService: ConfigService,
  ) {}

  @ApiTags('Авторизация')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @Post('/set-registration')
  @ApiBody({ type: CreateRegistrationDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Успешная регистрация',
    type: OutputUserAndTokens,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неккоректные данные',
  })
  async setRegistration(@Body() dto: CreateRegistrationDto, @Res({ passthrough: true }) res: Response) {
    return this.authClient
      .send('setRegistration', dto)
      .pipe(
        tap(data => {
          console.log(data.refreshToken, 'data.refreshToken')
          res.cookie('refreshToken', data.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax'})
          }
        )
      )
      .pipe(
        catchError(async (error) => {
          return new RpcException(error)
        }),
      )
  }


  @ApiTags('Авторизация')
  @ApiOperation({
    summary: 'Разлогинить пользователя (Удалить refreshToken у пользователя)',
  })
  @Post('/logout')
  @ApiBody({ type: LogoutUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пользователь успешно разлогинен',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Пользователь не найден',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен',
  })
  @UseGuards(JwtAuthGuard)
  async logout(@Body() dto: LogoutUserDto) {
    return this.authClient
      .send('logout', dto)
      .pipe(
        catchError(async (error) => {
          return new RpcException(error)
        }),
      );
  }

  @ApiTags('Авторизация')
  @ApiOperation({
    summary: 'Удалить пользователя',
  })
  @Post('/delete-profile')
  @ApiBody({ type: LogoutUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Пользователь успешно разлогинен',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Пользователь не найден',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен',
  })
  @UseGuards(JwtAuthGuard)
  async deleteProfile(@Body('id') id: number) {
    return this.authClient
      .send('deleteProfile', id)
      .pipe(
        catchError(async (error) => {
          return new RpcException(error)
        }),
      );
  }


  @ApiTags('Авторизация')
  @ApiOperation({summary: 'Обновить токены для пользователя (требуется refreshToken в заголовке)'})
  @Post('/refresh-tokens')
  @ApiBody({ type: UuidDevice })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Операция прошла успешно.',
    type: OutputUserAndTokens,
  })
  // @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен',
  })
  async refreshTokens(@Body() dto: UuidDevice, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authClient
      .send('refreshTokens', { refreshToken: req.cookies.refreshToken, uuid: dto.uuid })
      .pipe(
        tap(data => {
          res.cookie('refreshToken', data.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'lax'})
          })      
        )
      .pipe(
        catchError(async (error) =>{
          return new RpcException(error)
          }),
        )
  }
  // async refreshTokens(@Param('user_id') user_id: number, @Req() req: any) {
  //   if(!Number(user_id)) {
  //       throw new BadRequestException('Ошибка ввода');
  //   }
  //   return this.authClient
  //     .send('refreshTokens', { user_id, refreshToken: req.refreshToken })
  //     .pipe(
  //       catchError((error) =>
  //         throwError(() => new RpcException(error.response)),
  //       ),
  //     );
  // }

  // @ApiTags('Авторизация')
  // @ApiOperation({
  //   summary: 'Создания администратора для тестирования (временно)',
  // })
  // @Post('/create-test-admin')
  // @ApiBody({ type: CreateUserDto })
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  //   description: 'Успешная регистрация',
  //   type: OutputJwtTokens,
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Пользователь с такой электронной почтой уже существует',
  //   type: ExceptionDto,
  // })
  // async createTestAdmin(@Body() dto: CreateUserDto) {
  //   return this.authClient
  //     .send('createSuperUser', dto)
  //     .pipe(
  //       catchError((error) =>
  //         throwError(() => new RpcException(error.response)),
  //       ),
  //     );
  // }


  @ApiTags('Авторизация')
  @ApiOperation({ summary: 'Получить всех пользователей' })
  // @UseGuards(JwtAuthGuard)
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Get('/users')
  // @ApiParam({
  //   name: 'id',
  //   example: 1,
  //   required: true,
  //   description: 'Идентификатор пользователя в базе данных',
  //   type: Number,
  // })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Получены данные пользователей',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Пользователь не найден',
  })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'JWT токен не указан в заголовках',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Некоректный JWT токен',
  // })
  async getAllUsers() {
    return this.authClient
      .send('getAllUsers', [])
      .pipe(
        catchError(async (error) => {
          return new RpcException(error)
        }),
      );
  }


  // @ApiTags('Авторизация')
  // @ApiOperation({ summary: 'Получить данные пользователя по ID' })
  // @UseGuards(JwtAuthGuard)
  // @Get('/user/:id')
  // @ApiParam({
  //   name: 'id',
  //   example: 1,
  //   required: true,
  //   description: 'Идентификатор пользователя в базе данных',
  //   type: Number,
  // })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Получены данные пользователя',
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'Пользователь не найден',
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'JWT токен не указан в заголовках',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Некоректный JWT токен',
  // })
  // async getUser(@Param('id') id: number) {
  //   if(!Number(id)) {
  //       throw new BadRequestException('Ошибка ввода');
  //   }
  //   return this.authClient
  //     .send('getUser', id)
  //     .pipe(
  //       catchError(async (error) => {
  //         return new RpcException(error)
  //       }),
  //     );
  // }


  @ApiTags('Авторизация')
  @ApiOperation({ summary: 'Проверка занаята ли электронная почта' })
  @Get('/check-email/:email')
  @ApiParam({
    name: 'email',
    example: 'test@email.ru',
    required: true,
    description: 'Электронная почта',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Электронная почта свободна',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Электронная почта занята',
  })
  async checkEmail(@Param('email') email: string) {
    return this.authClient
      .send('checkUserEmail', email)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }


  @ApiTags('Авторизация')
  @ApiOperation({ summary: 'Auth через VK SDK' })
  @Post('/loginByVk')
  @ApiBody({ type: VkLoginSdkDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Успешная регистрация',
    type: OutputJwtTokens,   
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Пользователь уже существует',
  })
  @ApiBody({ type: VkLoginSdkDto }) 
  async registrationVk(@Body() dto: VkLoginSdkDto) {
    console.log(dto, 'dto')
    return this.authClient
      .send('loginByVk', dto)
      .pipe(
        catchError(async (error) => {
          return new RpcException(error)
          }),
        )
  }


  @ApiTags('Авторизация')
  @Get('/check-admin')
  @ApiOperation({
    summary: 'Проверка на наличие прав администратора. (Необходим JWT токен)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'У пользователя есть права администратора.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'У пользователя нет прав администратора.',
  })
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или роль пользователя',
  })
  checkAdmin() {
    return {
      statusCode: HttpStatus.OK,
      message: 'У пользователя есть права администратора.',
    };
  }


  @ApiTags('Авторизация')
  @Post('/add-role')
  @ApiOperation({
    summary: 'Добавить роль пользователю',
  })
  @ApiBody({
    type: AddRoleDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Операция прошла успешно.',
  })
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или роль пользователя',
  })
  async userAddRole(@Body() dto: AddRoleDto) {
    return this.authClient
      .send('userAddRole', dto)
      .pipe(
        catchError(async (error) => {
          return new RpcException(error)
        }),
      );
  }


  @ApiTags('Авторизация')
  @Delete('/remove-role')
  @ApiOperation({
    summary: 'Удалить роль у пользователя',
  })
  @ApiBody({
    type: AddRoleDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Операция прошла успешно.',
  })
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'JWT токен не указан в заголовках',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Некоректный JWT токен или роль пользователя',
  })
  async userRemoveRole(@Body() dto: AddRoleDto) {
    return this.authClient
      .send('userRemoveRole', dto)
      .pipe(
        catchError(async (error) => {
          return new RpcException(error)
        }),
      );
  }


  @ApiTags('Авторизация')
  @Get('/get-all-roles')
  @ApiOperation({
    summary: 'Получить список ролей',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Операция прошла успешно.',
  })
  async getAllRoles() {
    return this.authClient
      .send('getAllRoles', {})
      .pipe(
        catchError(async (error) => {
          return new RpcException(error)
        }),
      );
  }


  @ApiTags('Локация')
  @Post('/create-residency')
  @ApiOperation({
    summary: 'Сохранить место жительства',
  })
  @ApiBody({
    type: CreateResidencyDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Операция прошла успешно.',
  })
  // @Roles(ROLES.ADMIN)
  // @UseGuards(RolesGuard)
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'JWT токен не указан в заголовках',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Некоректный JWT токен или роль пользователя',
  // })
  async createResidency(@Body() dto: CreateResidencyDto) {
    return this.authClient
      .send('createResidency', dto)
      .pipe(
        catchError(async (error) => {
          return new RpcException(error)}),
      );
  }

  @ApiTags('Авторизация')
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @Get('/all-residencys')
  // @ApiParam({
  //   name: 'id',
  //   example: 1,
  //   required: true,
  //   description: 'Идентификатор пользователя в базе данных',
  //   type: Number,
  // })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Получены данные пользователей',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Пользователь не найден',
  })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'JWT токен не указан в заголовках',
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Некоректный JWT токен',
  // })
  async getAllResydencys() {
    return this.authClient
      .send('getAllResydencys', [])
      .pipe(
        catchError(async (error) => {
          return new RpcException(error)
        }),
      );
  }

  @ApiTags('Декларация Родной партии')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @Post('/add-declaration')
  @ApiBody({ type: CreateDeclarationDto })
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
  async addDeclaration(@Body() form: any) {
    return this.authClient
      .send('addDeclaration', form)
      .pipe(
        catchError(async (error) => {
          return new RpcException(error)
        }),
      )
  }

  @ApiTags('Декларация Родной партии')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @Get('/get-declaration/:id')
  @ApiParam({
    name: 'id',
    example: 1,
    required: true,
    description: 'Идентификатор пользователя в базе данных',
    type: Number,
  })
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
  async getDeclaration(@Param('id') id: number) {
    return this.authClient
      .send('getDeclaration', id)
      .pipe(
        catchError(async (error) => {
          return new RpcException(error)
        }),
      )
  }

  @ApiTags('Изменение персональных данных')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @Post('/updata-personale/:secret')
  @ApiBody({ type: UpdatePersonaleDto })
  @ApiParam({
    name: 'secret',
    example: 'sdfsdfsd',
    required: true,
    description: 'Кодовое слово',
    type: String,
  })
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
  async udatePersonaleData(@Param('secret') secret: string, @Body() form: any) {
    return this.authClient
      .send('udatePersonaleData', {secret, form})
      .pipe(
        catchError(async (error) => {
          return new RpcException(error)
        }),
      )
  }
} 



