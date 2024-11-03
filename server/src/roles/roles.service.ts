import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from 'src/common/dtos/create-role.dto';
import { Role } from 'src/common/models/users/role.model';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async create(dto: CreateRoleDto): Promise<Role> {
        try {
            const candidate = await this.roleRepository.findOne({
                where: { value: dto.value },
            });

            if (candidate) {
                throw new HttpException('Такая роль уже существует', HttpStatus.FORBIDDEN);
            }

            const role = await this.roleRepository.create(dto);
            return role;
        } catch (err) {
            throw new HttpException(`Ошибка в create: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllRoles(): Promise<Role[]> {
        try {
            const roles = await this.roleRepository.findAll();
            return roles;
        } catch (err) {
            throw new HttpException(`Ошибка в getAllRoles: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getRoleByValue(value: string): Promise<Role> {
        try {
            const role = await this.roleRepository.findOne({ where: { value } });
            return role;
        } catch (err) {
            throw new HttpException(`Ошибка в getRoleByValue: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
