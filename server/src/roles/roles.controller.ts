import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/models/users/role.model';
import { RolesService } from 'src/roles/roles.service';

@Controller()
export class RolesController {
    constructor(private readonly roleService: RolesService) {}

    @ApiTags('Авторизация')
    @Get('/get-all-roles')
    @ApiOperation({
        summary: 'Получить список ролей',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Операция прошла успешно.',
    })
    async getAllRoles(): Promise<Role[]> {
        return await this.roleService.getAllRoles();
    }
}
