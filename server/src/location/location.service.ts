import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { CreateLocationDto } from 'src/common/dtos/create-location.dto';
import { GeoLocations } from 'src/common/models/main/location.model';

@Injectable()
export class LocationService {
    constructor(@InjectModel(GeoLocations) private locationRepository: typeof GeoLocations) {}

    async createLocation(dto: CreateLocationDto[]): Promise<GeoLocations[]> {
        try {
            const locality = await this.locationRepository.bulkCreate(dto);
            return locality;
        } catch (err) {
            throw new HttpException(`Ошибка в createLocation: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getLocation(country: string, region: string, locality: string): Promise<GeoLocations> {
        try {
            const result = await this.locationRepository.findOne({
                where: {
                    country: country,
                    region: region,
                    locality: locality,
                },
            });
            return result;
        } catch (err) {
            throw new HttpException(`Ошибка в getLocation: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getAllCountry(): Promise<any> {
        try {
            const result = await this.locationRepository.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('country')), 'country']],
            });
            return result;
        } catch (err) {
            throw new HttpException(`Ошибка в getAllCountry: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getRegions(country: string): Promise<any> {
        try {
            const result = await this.locationRepository.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('region')), 'region']],
                where: { country: country },
            });
            return result;
        } catch (err) {
            throw new HttpException(`Ошибка в getRegions: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async getLocality(region: string): Promise<any> {
        try {
            const result = await this.locationRepository.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('locality')), 'locality']],
                where: { region: region },
            });
            return result;
        } catch (err) {
            throw new HttpException(`Ошибка в getLocality: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    async saveLocation(dto: CreateLocationDto): Promise<any> {
        try {
            const result = 'результат';
            // const result = await this.locationRepository.create(country, region, locality);
            return result;
        } catch (err) {
            throw new HttpException(`Ошибка в saveLocation: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
