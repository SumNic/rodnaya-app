import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateLocationDto } from 'src/common/dtos/create-location.dto';
import { CreateResidencyDto } from 'src/common/dtos/create-residency.dto';
import { Residency } from 'src/common/models/users/residency.model';

@Injectable()
export class ResidencyService {
    constructor(@InjectModel(Residency) private readonly residencyRepository: typeof Residency) {}
    
    async getOrCreateResidency(dto: CreateLocationDto): Promise<CreateResidencyDto> {
        try {
            const [residency] = await this.residencyRepository.findOrCreate({
                where: {
                    country: dto.country,
                    region: dto.region,
                    locality: dto.locality,
                },
            });
            return residency;
        } catch (err) {
            throw new HttpException(`Ошибка в getOrCreateResidency: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getResidency(id: number): Promise<Residency> {
        try {
            const residency = await this.residencyRepository.findOne({
                where: { id: id },
                include: { all: true },
            });
            return residency;
        } catch (err) {
            throw new HttpException(`Ошибка в getResidency: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getResidencyFromData(country: string, region: string, locality: string): Promise<Residency> {
        try {
            const residency = await this.residencyRepository.findOne({
                where: {
                    country,
                    region,
                    locality,
                },
                include: { all: true },
            });
            return residency;
        } catch (err) {
            throw new HttpException(`Ошибка в getResidencyFromData: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getAllResydencys(): Promise<Residency[]> {
        try {
            const residency = await this.residencyRepository.findAll({
                include: { all: true },
            });
            return residency;
        } catch (err) {
            throw new HttpException(`Ошибка в getAllResydencys: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
