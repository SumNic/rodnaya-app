import { LOCATION_SERVICE } from '@app/common/constants/services';
import { CreateLocationDto } from '@app/models/dtos/create-location.dto';
import { Body, Controller, Get, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { catchError, throwError } from 'rxjs';

@Controller()
export class AppLocationController {
    constructor(@Inject(LOCATION_SERVICE) private authClient: ClientProxy, private configService: ConfigService) {}

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
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'JWT токен не указан в заголовках',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Некоректный JWT токен или роль пользователя',
    })
    async crateLocation(@Body() dto: CreateLocationDto[]) {
        return this.authClient
            .send('createLocation', dto)
            .pipe(catchError((error) => throwError(() => new RpcException(error.response))));
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
            .pipe(catchError((error) => throwError(() => new RpcException(error.response))));
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
        return this.authClient
            .send('getRegions', country)
            .pipe(catchError((error) => throwError(() => new RpcException(error.response))));
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
        return this.authClient
            .send('getLocality', region)
            .pipe(catchError((error) => throwError(() => new RpcException(error.response))));
    }
}
