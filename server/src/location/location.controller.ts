import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/guards/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ROLES } from 'src/common/constants/roles';
import { CreateLocationDto } from 'src/common/dtos/create-location.dto';
import { GeoLocations } from 'src/common/models/main/location.model';
import { LocationService } from 'src/location/location.service';

@Controller('api')
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

    @ApiTags('Локация')
    @Post('/add-location')
    @ApiOperation({
        summary: 'Добавить место жительства',
    })
    @ApiBody({
        type: [CreateLocationDto],
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
    async crateLocation(@Body() dto: CreateLocationDto[]): Promise<GeoLocations[]> {
        return this.locationService.createLocation(dto);
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
    async getAllCountry(): Promise<Location> {
        return await this.locationService.getAllCountry();
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
    async getRegions(@Param('country') country: string): Promise<Location> {
        return await this.locationService.getRegions(country);
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
    async getLocality(@Param('region') region: string): Promise<Location> {
        return await this.locationService.getLocality(region);
    }
}
