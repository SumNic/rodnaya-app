import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi/lib';
import { JwtModule } from '@nestjs/jwt';
import * as cookieParser from 'cookie-parser';
import { SequelizeModule } from '@nestjs/sequelize';
import { GeoLocations } from 'src/common/models/main/location.model';
import { FooulSendMessage } from 'src/common/models/admin/foulSendMessage.model';
import { Declaration } from 'src/common/models/users/declaration.model';
import { Messages } from 'src/common/models/messages/messages.model';
import { ManageMessages } from 'src/common/models/messages/manageMessages.model';
import { EndReadMessage } from 'src/common/models/messages/endReadMessage.model';
import { Residency } from 'src/common/models/users/residency.model';
import { Token } from 'src/common/models/users/tokens.model';
import { Role } from 'src/common/models/users/role.model';
import { User } from 'src/common/models/users/user.model';
import { UserRoles } from 'src/common/models/users/user-roles.model';
import { AdminController } from 'src/admin/admin.controller';
import { AdminModule } from 'src/admin/admin.module';
import { AuthModule } from 'src/auth/auth.module';
import { DeclarationController } from 'src/declaration/declaration.controller';
import { DeclarationModule } from 'src/declaration/declaration.module';
import { FilesController } from 'src/files/files.controller';
import { FilesModule } from 'src/files/files.module';
import { LocationController } from 'src/location/location.controller';
import { LocationModule } from 'src/location/location.module';
import { MessagesController } from 'src/messages/messages.controller';
import { MessagesModule } from 'src/messages/messages.module';
import { ResidencyController } from 'src/residency/residency.controller';
import { ResidencyModule } from 'src/residency/residency.module';
import { RolesController } from 'src/roles/roles.controller';
import { RolesModule } from 'src/roles/roles.module';
import { TokensController } from 'src/tokens/tokens.controller';
import { TokensModule } from 'src/tokens/tokens.module';
import { UsersController } from 'src/users/users.controller';
import { UsersModule } from 'src/users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { Files } from 'src/common/models/files/files.model';
import { EndReadMessageModule } from 'src/end-read-message/end-read-message.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                PORT: Joi.number().required(),
                CLIENT_URL: Joi.string().required(),
                JWT_SECRET: Joi.string().required(),
                JWT_REFRESH_SECRET: Joi.string().required(),
                JWT_EXPIRATION: Joi.string().required(),
                POSTGRES_URI: Joi.string().required(),
                DOMEN: Joi.string().required(),
            }),
            envFilePath: '.env',
        }),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
                },
                configure(consumer: MiddlewareConsumer) {
                    consumer.apply(cookieParser()).forRoutes('*');
                },
            }),
            inject: [ConfigService],
        }),
        SequelizeModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('POSTGRES_URI'),
                dialect: 'postgres',
                models: [
                    FooulSendMessage,
                    Declaration,
                    GeoLocations,
                    Messages,
                    ManageMessages,
                    EndReadMessage,
                    Residency,
                    Token,
                    Role,
                    User,
                    UserRoles,
                    Files
                ],
                autoLoadModels: true,
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, '..', 'static'),
        }),
        AuthModule,
        AdminModule,
        DeclarationModule,
        FilesModule,
        MessagesModule,
        ResidencyModule,
        RolesModule,
        TokensModule,
        UsersModule,
        LocationModule,
        EndReadMessageModule,
    ],
    controllers: [
        AdminController,
        DeclarationController,
        FilesController,
        MessagesController,
        ResidencyController,
        RolesController,
        TokensController,
        UsersController,
        LocationController,
    ],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(cookieParser()).forRoutes('*');
    }
}