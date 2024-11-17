import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/guards/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ROLES } from 'src/common/constants/roles';
import { CreateRoleDto } from 'src/common/dtos/create-role.dto';
import { Role } from 'src/common/models/users/role.model';
import { RolesService } from 'src/roles/roles.service';

@Controller('api')
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

    @ApiTags('Авторизация')
    @Post('/create-new-role')
    @ApiOperation({
        summary: 'Создать новую роль',
    })
    @ApiBody({
        type: CreateRoleDto,
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Операция прошла успешно.',
    })
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    async create(@Body() dto: CreateRoleDto): Promise<Role> {
        return await this.roleService.create(dto);
    }
}
