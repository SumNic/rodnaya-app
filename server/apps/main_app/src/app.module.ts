import {
    AuthModule,
    RmqModule,
  } from '@app/common';
  import { forwardRef, Module } from '@nestjs/common';
  import { ConfigModule } from '@nestjs/config';
  import * as Joi from 'joi';
  import { AppAuthController } from './app.auth.controller';
import { AppLocationController } from './app.location.controller';
import { LocationModule } from 'apps/location/src/location.module';
import { LOCATION_SERVICE, MESSAGES_SERVICE, USERS_SERVICE } from '@app/common/constants/services';
import { AppMessagesController } from './app.message.controller';
import { AppFilesController } from './app.files.controller';
  
  @Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        validationSchema: Joi.object({
          PORT: Joi.number().required(),
          CLIENT_URL: Joi.string().required(),
        }),
        envFilePath: './apps/main_app/.env',
      }),
      forwardRef(() => AuthModule),
      RmqModule.register({ name: LOCATION_SERVICE }),
      // RmqModule.register({ name: MESSAGES_SERVICE }),
      RmqModule.register({ name: USERS_SERVICE }),
    ],
    controllers: [
      AppAuthController,
      AppLocationController,
      AppMessagesController,
      AppFilesController,
    ],
    providers: [],
  })
  export class AppModule {}