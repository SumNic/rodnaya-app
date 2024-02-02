import { Controller } from '@nestjs/common';
import { LocationService } from './location.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateCountryDto, CreateLocationDto, UpdateCountryDto } from '@app/models';
import { Residency } from '@app/models/models/users/residency.model';
import { RmqService } from '@app/common';
import { Location } from '@app/models/models/main/location.model';

@Controller()
export class LocationController {
  // rmqService: any;
  constructor(private readonly locationService: LocationService,
              private readonly rmqService: RmqService,) {}

  // /**
  //  * Создает страны при заполнении бд.
  //  * @param {CreateCountryDto[]} createCountryDtoArray DTO для создания стран из массива.
  //  * @returns Country[] - Массив созданных стран 
  //  */
  // @MessagePattern('createManyCountry')
  // async createMany(
  //   @Payload() createCountryDtoArray: CreateCountryDto[],
  // ): Promise<Country[]> {
  //   return await this.locationService.createMany(createCountryDtoArray);
  // }

  // /**
  //  * Создает одну новую страну.
  //  * @param {CreateCountryDto} createCountryDto - DTO для создание страны.
  //  * @returns Country - Созданная страна
  //  */
  // @MessagePattern('createCountry')
  // async create(
  //   @Payload() createCountryDto: CreateCountryDto,
  // ): Promise<Country> {
  //   return await this.locationService.create(createCountryDto);
  // }

  // /**
  //  * Получить список всех стран.
  //  * @returns Country[] - Список найденных стран.
  //  */
  // @MessagePattern('findAllCountry')
  // async findAll(): Promise<Country[]> {
  //   return await this.locationService.findAll();
  // }

  // /**
  //  * Найти одну страну по ID.
  //  * @param {number} id - Идентификатор страны.
  //  * @returns Country - Найденная страна.
  //  */
  // @MessagePattern('findOneCountry')
  // async findOne(@Payload() id: number): Promise<Country> {
  //   return await this.locationService.findOne(id);
  // }

  // /**
  //  * Найти страну по названию.
  //  * @param {string} name - Название страны.
  //  * @returns Country - Найденная страна.
  //  */
  // @MessagePattern({ cmd: 'findOneByNameCountry' })
  // async findOneByName(@Payload() name: string): Promise<Country> {
  //   return await this.locationService.findByname(name);
  // }

  // /**
  //  * Обновить данные о стране.
  //  * @param {UpdateCountryDto} updateCountryDto - DTO для обновления данных о стране.
  //  * @returns Country - Обновленная страна.
  //  */
  // @MessagePattern('updateCountry')
  // async update(
  //   @Payload() updateCountryDto: UpdateCountryDto,
  // ): Promise<Country> {
  //   return await this.locationService.update(
  //     updateCountryDto.id,
  //     updateCountryDto,
  //   );
  // }

  // /**
  //  * Удалить страну.
  //  * @param {number} id - Идентификатор страны.
  //  * @returns Результат выполнения функции.
  //  */
  // @MessagePattern('removeCountry')
  // async remove(@Payload() id: number): Promise<any> {
  //   return await this.locationService.remove(id);
  // }

  // /**
  //  * Получить массив стран по списку названий.
  //  * @param {string[]} names - Списк названий стран.
  //  * @returns Country[] - Массив найденных стран.
  //  */
  // @MessagePattern({ cmd: 'getCountriesByNames' })
  // async getCountriesByNamesHandle(
  //   @Payload() names: string[],
  // ): Promise<Country[]> {
  //   return await this.locationService.getCountriesByNamesArray(names);
  // }


    /**
   * Добавить место жительства.
   * @param {CreateLocationDto[]} dto - DTO для добавления роли пользоветилю.
   */
   @MessagePattern('createLocation')
   createLocation(@Payload() dto: CreateLocationDto[], @Ctx() context: RmqContext): Promise<Location[]> {
    console.log(dto, 'dto')
      this.rmqService.ack(context);
      return this.locationService.createLocation(dto);
   }

  /**
   * Получить список всех стран.
   * @returns LocationUser - Список найденных стран.
   */
   @MessagePattern('getAllCountry')
   async getAllCountry(): Promise<Location> {
     return await this.locationService.getAllCountry(); 
   }

  /**
   * Получить список регионов.
   * @returns LocationUser - Список регионов.
   */
   @MessagePattern('getRegions')
   async getRegions(@Payload() country: string): Promise<Location> {
     return await this.locationService.getRegions(country); 
   }

  /**
   * Получить список райнов.
   * @returns LocationUser - Список районов и городв.
   */
   @MessagePattern('getLocality')
   async getLocality(@Payload() region: string): Promise<Location> {
     return await this.locationService.getLocality(region);
   }

  
}
