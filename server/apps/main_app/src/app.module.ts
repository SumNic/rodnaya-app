import { AuthModule, RmqModule } from '@app/common';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppAuthController } from './app.auth.controller';
import { AppLocationController } from './app.location.controller';
import { LocationModule } from 'apps/location/src/location.module';
import { LOCATION_SERVICE, MESSAGES_SERVICE, USERS_SERVICE } from '@app/common/constants/services';
import { AppMessagesController } from './app.message.controller';
import { AppFilesController } from './app.files.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { AppAdminController } from 'apps/main_app/src/app.admin.controller.js';

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
        RmqModule.register({ name: USERS_SERVICE }),
        //   ServeStaticModule.forRoot({
        //     rootPath: path.resolve(__dirname, '..', 'static'),
        //   }),
    ],
    controllers: [AppAuthController, AppLocationController, AppMessagesController, AppFilesController, AppAdminController],
    providers: [],
})
export class AppModule {}
