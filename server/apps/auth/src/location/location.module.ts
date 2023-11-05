import { LocationUser } from '@app/models/models/users/location.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  providers: [LocationService],

  imports: [
    SequelizeModule.forFeature([LocationUser])
  ],
  controllers: [LocationController],
  exports: [LocationService],
})
export class LocationModule {}
