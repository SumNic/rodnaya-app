import { CreateDeclarationDto } from '@app/models/dtos/create-declaration.dto';
import { Declaration } from '@app/models/models/users/declaration.model';
import { User } from '@app/models/models/users/user.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class DeclarationService {
    constructor(
        @InjectModel(Declaration) private readonly declarationRepository: typeof Declaration,
    ) {}

    /**
   * Добавить декларацию Родной партии.
   * @param {any} dto - DTO для добавления декларации.
   * @returns AddRoleDto - Данные роли.
   */
    async createDeclaration(declaration: string): Promise<Declaration> {
        return await this.declarationRepository.create({declaration: declaration})

        // if (role && user) {
        //   await user.$remove('role', role.id);
 
        //   return dto; 
        // }

        // throw new RpcException(
        //   new NotFoundException('Пользователь или роль не найдены'),
        // );
    }

    /**
   * Добавить декларацию Родной партии.
   * @param {any} dto - DTO для добавления декларации.
   * @returns AddRoleDto - Данные роли.
   */
    async updateDeclaration(dto: CreateDeclarationDto): Promise<Declaration> {
        const declaration = await this.declarationRepository.findOne({
            where: 
                {
                    userId: dto.id
                }})
        await declaration.update({ declaration: dto.declaration })
        // const declaration = await this.declarationRepository.create(dto)
        console.log(declaration, 'dendeclaration2')
        return declaration

        // if (role && user) {
        //   await user.$remove('role', role.id);

        //   return dto;
        // }

        // throw new RpcException(
        //   new NotFoundException('Пользователь или роль не найдены'),
        // );
    }

    /**
   * Удалить декларацию Родной партии.
   * @param {any} dto - DTO для добавления декларации.
   * @returns AddRoleDto - Данные роли.
   */
    async deleteDeclaration(id: number): Promise<any> {
        const declaration = await this.declarationRepository.findOne({
            where: 
                {
                    userId: id
                }})
        return await declaration.destroy()
    }
}
