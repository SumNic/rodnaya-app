import { JwtAuthGuard, JwtRefreshGuard, ROLES } from '@app/common';
import { Roles } from '@app/common/auth/roles-auth.decorator';
import { RolesGuard } from '@app/common/auth/roles.guard';
import { AUTH_SERVICE } from '@app/common/auth/service';
import { LOCATION_SERVICE } from '@app/common/constants/services';
import {
  AddRoleDto,
  CreateUserDto,
  ExceptionDto,
  GoogleResponseDto,
  OutputJwtTokens,
  UserGmailOAuth,
} from '@app/models';
import { CreateLocationDto } from '@app/models/dtos/create-location.dto';
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
  Query,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { catchError, throwError } from 'rxjs';

@Controller()
export class AppLocationController {
  constructor(
    @Inject(LOCATION_SERVICE) private authClient: ClientProxy,
    private configService: ConfigService,
  ) {}

  @ApiTags('Локация')
  @Post('/add-location')
  @ApiOperation({
    summary: 'Добавить место жительства',
  })
  @ApiBody({
    type: CreateLocationDto,
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
  async crateLocation(@Body() dto: CreateLocationDto[]) {
    return this.authClient
      .send('createLocation', dto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Локация')
  @Get('/country')
  @ApiOperation({
    summary: 'Получить список стран',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Операция прошла успешно.',
  })
  async getAllCountry() {
    
    return this.authClient
      .send('getAllCountry', {})
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Локация')
  @Get('/region/:country')
  @ApiOperation({
    summary: 'Получить список регионов',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Операция прошла успешно.',
  })
  async getRegions(@Param('country') country: string) {
    console.log(country)
    
    return this.authClient
      .send('getRegions', country)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  @ApiTags('Локация')
  @Get('/locality/:region')
  @ApiOperation({
    summary: 'Получить список районов',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Операция прошла успешно.',
  })
  async getLocality(@Param('region') region: string) {
    console.log(region)
    
    return this.authClient
      .send('getLocality', region)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  } 

  @ApiTags('Локация')
  @Post('/save-location')
  @ApiOperation({
    summary: 'Сохранить место жительства',
  })
  @ApiBody({
    type: CreateLocationDto,
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
  async saveLocation(@Body() dto: CreateLocationDto) {
    return this.authClient
      .send('saveLocation', dto)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
} 



