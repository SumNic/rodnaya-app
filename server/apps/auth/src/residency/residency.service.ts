import { CreateLocationDto } from '@app/models/dtos/create-location.dto';
import { ResidencyUser } from '@app/models/models/users/residency.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ResidencyService {
    constructor(
        @InjectModel(ResidencyUser) private readonly residencyRepository: typeof ResidencyUser,
        // private roleService: RolesService, 
      ) {}

    /**
   * Создать место жительства.
   * @param {CreateLocationDto[]} dto - DTO для создания места жительства.
   * @returns LocationUser - Созданная место жительства.
   * @throws BadRequetException
   */
  async createLocation(dto: CreateLocationDto[]): Promise<ResidencyUser[]> {
    // const candidate = await this.locationRepository.findOne({
    //   where: { locality: dto.locality },
    // });

    // if (candidate) {
    //   throw new RpcException(
    //     new BadRequestException('Такое место жительства уже существует'),
    //   );
    // }

    const locality = await this.residencyRepository.bulkCreate(dto); 

    return locality;
  }

  /**
   * Получить список всех стран.
   * @returns LocationUser - Список найденных стран.
   */
  async getAllCountry(): Promise<any> {
    const result = await this.residencyRepository.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('country')) ,'country'],
      ]
    });

    return result;                 
  }

  /**
   * Получить список регионов.
   * @returns LocationUser - Список регионов.
   */
   async getRegions(country: string): Promise<any> {
    const result = await this.residencyRepository.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('region')) ,'region'],],
      where: { country: country }
    });

    return result;                 
  }

  /**
   * Получить список районов.
   * @returns LocationUser - Список районов.
   */
   async getLocality(region: string): Promise<any> {
    const result = await this.residencyRepository.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('locality')) ,'locality'],],
      where: { region: region }
    });

    return result;                
  }

  /**
   * Сохранить место жительства.
   * @returns LocationUser - Список районов.
   */
   async saveLocation(dto: CreateLocationDto): Promise<any> {
    console.log(dto)
    const result = 'результат'
    // const result = await this.locationRepository.create(country, region, locality);

    return result;                
  }
}
