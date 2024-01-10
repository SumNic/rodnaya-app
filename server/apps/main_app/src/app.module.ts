import {
    AuthModule,
    RmqModule,
  } from '@app/common';
  import { forwardRef, Module } from '@nestjs/common';
  import { ConfigModule } from '@nestjs/config';
  import * as Joi from 'joi';
  import { AppAuthController } from './app.auth.controller';
  
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
    ],
    controllers: [
      AppAuthController,
    ],
    providers: [],
  })
  export class AppModule {}