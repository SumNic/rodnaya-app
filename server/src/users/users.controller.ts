import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags, PartialType } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ROLES } from 'src/common/constants/roles';
import { AddRoleDto } from 'src/common/dtos/add-role.dto';
import { BlockedUserDto } from 'src/common/dtos/blocked-user.dto';
import { CreateDeclarationDto } from 'src/common/dtos/create-declaration.dto';
import { CreateResidencyDto } from 'src/common/dtos/create-residency.dto';
import { GetDeclarationDto } from 'src/common/dtos/get-declaration.dto';
import { UpdatePersonaleDto } from 'src/common/dtos/update-personale.dto';
import { Group } from 'src/common/models/groups/groups.model';
import { Declaration } from 'src/common/models/users/declaration.model';
import { Residency } from 'src/common/models/users/residency.model';
import { Role } from 'src/common/models/users/role.model';
import { User } from 'src/common/models/users/user.model';
import { AuthenticatedRequest } from 'src/common/types/types';
import { UsersService } from 'src/users/users.service';

export class UpdateUserDto extends PartialType(User) {}

@Controller('api')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiTags('Пользователи')
    @ApiOperation({ summary: 'Получить всех пользователей' })
    // @UseGuards(JwtAuthGuard)
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @Get('/users')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Получены данные пользователей',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Пользователь не найден',
    })
    async getAllUsers(): Promise<User[]> {
        return await this.usersService.getAllUsers();
    }

    @ApiTags('Пользователи')
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
    async userAddRole(@Body() dto: AddRoleDto): Promise<AddRoleDto> {
        return await this.usersService.addRole(dto);
    }

    @ApiTags('Пользователи')
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
    async userRemoveRole(@Body() dto: AddRoleDto): Promise<AddRoleDto> {
        return await this.usersService.removeRole(dto);
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
    // @UseGuards(JwtAuthGuard)
    async createResidency(@Body() dto: CreateResidencyDto) {
        return await this.usersService.createResidencyForUser(dto);
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
        return await this.usersService.addDeclaration(form);
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
    async getDeclaration(@Param('id') id: number): Promise<GetDeclarationDto> {
        return await this.usersService.getDeclaration(id);
    }

    @ApiTags('Изменение данных')
    @ApiOperation({ summary: 'Изменение персональных данных' })
    @Post('/updata-personale')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(ROLES.USER, ROLES.ADMIN)
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Нет прав' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Данные обновлены',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    async updatePersonaleData(@Req() req: AuthenticatedRequest, @Body() dto: UpdateUserDto) {
        return await this.usersService.updatePersonaleData(req.user, dto);
    }

    @ApiTags('Изменение данных')
    @ApiOperation({ summary: 'Изменение аватара' })
    @Post('/upload-avatar')
    // @ApiBody({ type: CreateMessageDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Аватар изменен',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Body('userId') userId: string): Promise<User> {
        if (file.size > 20000000) throw new HttpException('Размер файла должен быть не более 20мб', HttpStatus.BAD_REQUEST);
        const arrTypeFile = ['image/jpg', 'image/png', 'image/jpeg'];
        const isType = arrTypeFile.reduce((accum: number, type: string) => {
            if (file.mimetype === type) {
                return accum + 1;
            }
            return accum;
        }, 0);
        if (!isType) throw new HttpException('Допустимы расширения: jpg, png, jpeg', HttpStatus.BAD_REQUEST);
        return await this.usersService.saveAvatar(file, userId);
    }

    @ApiTags('Блокировка пользователя')
    @ApiOperation({ summary: 'Блокировка пользователя, нарушившего правила' })
    @Post('/blocked-user')
    @ApiBody({ type: BlockedUserDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Пользователь заблокирован',
        // type: OutputUserAndTokens,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @Roles(ROLES.ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    async blockedUser(@Body() dto: BlockedUserDto): Promise<string> {
        return await this.usersService.blockedUser(dto);
    }

    @ApiOperation({ summary: 'Проверить блокировку пользователя и время блокировки' })
    @Get('/check-blocked')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Сообщение о нарушении правил доставлено',
        type: Date,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    @UseGuards(JwtAuthGuard)
    async checkBlocked(@Query('userId') userId: number): Promise<Date> {
        return await this.usersService.checkBlocked(userId);
    }

    @ApiOperation({ summary: 'Получить пользователя' })
    @Get('/get-user/:id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Получение пользователя по его Id',
        type: Date,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Неккоректные данные',
    })
    async getUser(@Param('id') id: number): Promise<User> {
        return await this.usersService.getUserWithModel(id, [
            { model: Residency },
            { model: Declaration },
            { model: Role },
            {
                model: Group,
                as: 'userGroups',
            },
            {
                model: Group,
                as: 'adminGroups',
            },
        ]);
    }
}
