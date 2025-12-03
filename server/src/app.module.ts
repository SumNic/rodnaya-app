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
import { PublicationsController } from './publications/publications.controller';
import { PublicationsModule } from './publications/publications.module';
import { Publications } from 'src/common/models/publications/publications.model';
import { GroupsController } from './groups/groups.controller';
import { GroupsModule } from './groups/groups.module';
import { Group } from 'src/common/models/groups/groups.model';
import { GroupMessage } from 'src/common/models/groups/groupMessage';
import { UserGroups } from 'src/common/models/users/user-groups.model';
import { GroupAdmins } from 'src/common/models/groups/group-admins.model';
import { LastReadPostChat } from 'src/common/models/groups/lastReadPostChat.model';
import { TelegramService } from './telegram/telegram.service';
import { TelegramModule } from './telegram/telegram.module';
import { PublicationComments } from 'src/common/models/publications/publications-comments.model';
import { RefreshTokenMiddleware } from 'src/common/middleware/refresh-token.middleware';
import { UserDeviceToken } from 'src/common/models/users/userDeviceToken.model';
import { DeviceTokensController } from './device-tokens/device-tokens.controller';
import { DeviceTokensModule } from 'src/device-tokens/device-tokens.module';
import { BullModule } from '@nestjs/bullmq';
import { InfoModule } from './info/info.module';
import { Info } from 'src/common/models/info/info.model';
import { InfoController } from 'src/info/info.controller';

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
                    Publications,
                    Residency,
                    Token,
                    Role,
                    User,
                    UserRoles,
                    Files,
                    Group,
                    GroupMessage,
                    LastReadPostChat,
                    UserGroups,
                    GroupAdmins,
                    PublicationComments,
                    UserDeviceToken,
                    Info,
                ],
                autoLoadModels: true,
                // synchronize: true,
            }),
            inject: [ConfigService],
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, '..', 'static'),
        }),
        BullModule.forRoot({
            connection: {
                host: process.env.REDIS_HOST || 'redis',
                port: Number(process.env.REDIS_PORT) || 6379,
            },
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
        PublicationsModule,
        GroupsModule,
        TelegramModule,
        DeviceTokensModule,
        InfoModule,
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
        PublicationsController,
        GroupsController,
        DeviceTokensController,
        InfoController,
    ],
    providers: [TelegramService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieParser(), RefreshTokenMiddleware).forRoutes('*');
    }
}
