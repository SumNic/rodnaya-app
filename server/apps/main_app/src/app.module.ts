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
import { LOCATION_SERVICE, USERS_SERVICE } from '@app/common/constants/services';
import { AppUsersController } from './app.message.controller';
import { MessagesController } from './messages/messages.controller';
  
  @Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        validationSchema: Joi.object({
          PORT: Joi.number().required(),
          GOOGLE_CLIENT_ID: Joi.string().required(),
          GOOGLE_SECRET: Joi.string().required(),
          VK_CLIENT_ID: Joi.string().required(),
          VK_CALLBACK: Joi.string().required(),
          VK_CLIENT_SECRET: Joi.string().required(),
        }),
        envFilePath: './apps/main_app/.env',
      }),
      forwardRef(() => AuthModule),
      RmqModule.register({ name: LOCATION_SERVICE }),
      RmqModule.register({ name: USERS_SERVICE }),
    ],
    controllers: [
      AppAuthController,
      AppLocationController,
      AppUsersController,
      MessagesController,
    ],
    providers: [],
  })
  export class AppModule {}