import { CreateCountryDto, CreateLocationDto, UpdateCountryDto } from '@app/models';
import { Location } from '@app/models/models/main/location.model';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location) private locationRepository: typeof Location,
  ) {}

      /**
   * Создать место жительства.
   * @param {CreateLocationDto[]} dto - DTO для создания места жительства.
   * @returns LocationUser - Созданная место жительства.
   * @throws BadRequetException
   */
  async createLocation(dto: CreateLocationDto[]): Promise<Location[]> {
    console.log('execut')
    // const candidate = await this.locationRepository.findOne({
    //   where: { locality: dto.locality },
    // });

    // if (candidate) {
    //   throw new RpcException(
    //     new BadRequestException('Такое место жительства уже существует'),
    //   );
    // }

    const locality = await this.locationRepository.bulkCreate(dto); 

    return locality;
  }

  /**
   * Проверка существования места жительства.
   * @returns Location - Найденное место жительства.
   */
  async getLocation(country: string, region: string, locality: string): Promise<Location> {
    const result = await this.locationRepository.findOne(
      {
        where: {
          country: country,
          region: region,
          locality: locality,
        }
      });

    return result;                 
  }

  /**
   * Получить список всех стран.
   * @returns LocationUser - Список найденных стран.
   */
  async getAllCountry(): Promise<any> {
    const result = await this.locationRepository.findAll({
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
    const result = await this.locationRepository.findAll({
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
    const result = await this.locationRepository.findAll({
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

  // /**
  //  * Создает страны при заполнении бд.
  //  * @param {CreateCountryDto[]} createCountryDtoArray DTO для создания стран из массива.
  //  * @returns Country[] - Массив созданных стран
  //  */
  // async createMany(
  //   createCountryDtoArray: CreateCountryDto[],
  // ): Promise<Location[]> {
  //   const countries = await this.locationRepository.bulkCreate(
  //     createCountryDtoArray,
  //     { ignoreDuplicates: true },
  //   );

  //   return countries;
  // }

  // /**
  //  * Создает одну новую страну.
  //  * @param {CreateCountryDto} createCountryDto - DTO для создание страны.
  //  * @returns Country - Созданная страна
  //  * @throws BadRequestException
  //  */
  // async create(createCountryDto: CreateCountryDto): Promise<Location> {
  //   const candidate = await this.locationRepository.findOne({
  //     where: { name: createCountryDto.name },
  //   });

  //   if (candidate) {
  //     throw new RpcException(
  //       new BadRequestException('Такая страна уже существует'),
  //     );
  //   }

  //   const country = await this.countryRepository.create(createCountryDto);

  //   return country;
  // }

  // /**
  //  * Получить список всех стран.
  //  * @returns Country[] - Список найденных стран.
  //  */
  // async findAll(): Promise<Country[]> {
  //   const countries = await this.countryRepository.findAll();

  //   return countries;
  // }

  // /**
  //  * Найти одну страну по ID.
  //  * @param {number} id - Идентификатор страны.
  //  * @returns Country - Найденная страна.
  //  * @throws NotFoundException
  //  */
  // async findOne(id: number): Promise<Country> {
  //   const country = await this.countryRepository.findOne({ where: { id } });

  //   if (!country) {
  //     throw new RpcException(new NotFoundException('Страна не найдена'));
  //   }

  //   return country;
  // }

  // /**
  //  * Найти страну по названию.
  //  * @param {string} name - Название страны.
  //  * @returns Country - Найденная страна.
  //  * @throws NotFoundException
  //  */
  // async findByname(name: string): Promise<Country> {
  //   const country = await this.countryRepository.findOne({
  //     where: { name },
  //   });

  //   if (!country) {
  //     throw new RpcException(new NotFoundException('Страна не найдена'));
  //   }

  //   return country;
  // }

  // /**
  //  * Обновить данные о стране.
  //  * @param {UpdateCountryDto} updateCountryDto - DTO для обновления данных о стране.
  //  * @returns Country - Обновленная страна.
  //  */
  // async update(
  //   id: number,
  //   updateCountryDto: UpdateCountryDto,
  // ): Promise<Country> {
  //   const country = await this.findOne(id);

  //   country.name = updateCountryDto.name;

  //   await country.save();

  //   return country;
  // }

  // /**
  //  * Удалить страну.
  //  * @param {number} id - Идентификатор страны.
  //  * @returns Результат выполнения функции.
  //  */
  // async remove(id: number): Promise<any> {
  //   const country = await this.findOne(id);

  //   await country.destroy();

  //   return { status: HttpStatus.OK };
  // }

  // /**
  //  * Получить массив стран по списку названий.
  //  * @param {string[]} names - Списк названий стран.
  //  * @returns Country[] - Массив найденных стран.
  //  */
  // async getCountriesByNamesArray(names: string[]): Promise<Country[]> {
  //   const countries = await this.countryRepository.findAll({
  //     where: {
  //       name: {
  //         [Op.or]: names,
  //       },
  //     },
  //   });

  //   if (!countries) {
  //     throw new RpcException(new NotFoundException('Страны не найдены'));
  //   }

  //   return countries; 
  // }
}
