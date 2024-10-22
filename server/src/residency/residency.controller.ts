import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Residency } from 'src/common/models/users/residency.model';
import { ResidencyService } from 'src/residency/residency.service';

@Controller()
export class ResidencyController {
    constructor(private readonly residencyService: ResidencyService) {}

    @ApiTags('Авторизация')
    @ApiOperation({ summary: 'Получить всех пользователей' })
    @Get('/all-residencys')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Получены данные пользователей',
        type: [Residency],
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Пользователь не найден',
    })
    async getAllResydencys(): Promise<Residency[]> {
        return await this.residencyService.getAllResydencys();
    }
}
