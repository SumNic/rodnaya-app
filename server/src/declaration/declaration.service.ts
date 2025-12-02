import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDeclarationDto } from 'src/common/dtos/create-declaration.dto';
import { Declaration } from 'src/common/models/users/declaration.model';

@Injectable()
export class DeclarationService {
    constructor(@InjectModel(Declaration) private readonly declarationRepository: typeof Declaration) {}

    async createDeclaration(declaration: string): Promise<Declaration> {
        try {
            return await this.declarationRepository.create({ declaration: declaration });
        } catch (err) {
            console.error(err, 'error in deleteProfile');
            throw new HttpException(`Ошибка в createDeclaration: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateDeclaration(dto: CreateDeclarationDto): Promise<Declaration> {
        try {
            const declaration = await this.declarationRepository.findOne({
                where: {
                    userId: dto.id,
                },
            });
            await declaration.update({ declaration: dto.declaration });
            return declaration;
        } catch (err) {
            console.error(err, 'error in deleteProfile');
            throw new HttpException(`Ошибка в updateDeclaration: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteDeclaration(id: number): Promise<any> {
        try {
            const declaration = await this.declarationRepository.findOne({
                where: {
                    userId: id,
                },
            });
            return await declaration.destroy();
        } catch (err) {
            console.error(err, 'error in deleteProfile');
            throw new HttpException(`Ошибка в deleteDeclaration: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
