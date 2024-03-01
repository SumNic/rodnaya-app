import { Secret } from '@app/models/models/users/secret.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class SecretService {
    constructor(
        @InjectModel(Secret) private readonly secretRepository: typeof Secret,
    ) {}

    /**
   * Добавить секретное слово.
   * @param {any} dto - DTO для добавления слова.
   * @returns Secret - Данные секрета.
   */
    async createSecret(secret: string): Promise<Secret> {
        return await this.secretRepository.create({secret})
    }

    /**
   * Удалить секретное слово.
   * @param {any} dto - DTO для удаления слова.
   * @returns AddRoleDto - Данные роли. 
   */
    async deleteSecret(id: number): Promise<any> {
        const secret = await this.secretRepository.findOne({
            where: 
                {
                    userId: id
                }})
        return await secret.destroy()
    }
}