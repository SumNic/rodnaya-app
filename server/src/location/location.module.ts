import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { LocationController } from 'src/location/location.controller';
import { GeoLocations } from 'src/common/models/main/location.model';

@Module({
    imports: [SequelizeModule.forFeature([GeoLocations])],
    controllers: [LocationController],
    providers: [LocationService],
    exports: [LocationService]
})
export class LocationModule {}
