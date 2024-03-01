import { CreateLocationDto } from '@app/models/dtos/create-location.dto';
import { CreateResidencyDto } from '@app/models/dtos/create-residency.dto';
import { Residency } from '@app/models/models/users/residency.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ResidencyService {
    constructor(
        @InjectModel(Residency) private readonly residencyRepository: typeof Residency,
      ) {}

  /**
   * Сохранить место жительства.
   * @returns LocationUser - Список районов.
   */
   async createResidency(dto: CreateLocationDto): Promise<CreateResidencyDto> {
    const [residency] = await this.residencyRepository.findOrCreate({
      where: { 
        country: dto.country,
        region: dto.region,
        locality: dto.locality
       }
    });
    return residency;                
  }

  /**
   * Найти место жительства по id.
   * @returns LocationUser - Список районов.
   */
   async getResidency(id: number): Promise<Residency> {
    const residency = await this.residencyRepository.findOne({
      where: { id: id },
      include: { all: true }
    });
    return residency;                
  }

  /**
   * Найти места жительства всех пользователей.
   * @returns Residency[] - Список районов.
   */
   async getAllResydencys(): Promise<Residency[]> {
    const residency = await this.residencyRepository.findAll({
      include: { all: true }
    });
    return residency;
  }
}
