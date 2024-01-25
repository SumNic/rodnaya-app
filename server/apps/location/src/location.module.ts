import { DatabaseModule, RmqModule } from '@app/common';
import { Location } from '@app/models';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as Joi from 'joi';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_LOCATION_QUEUE: Joi.string().required(),
        POSTGRES_URI: Joi.string().required(),
      }),
      envFilePath: './apps/location/.env',
    }),
    DatabaseModule,
    SequelizeModule.forFeature([Location]),
    RmqModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
