import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule, RmqModule } from '@app/common';
import { UserModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { HttpModule } from '@nestjs/axios';
import { ResidencyController } from './residency/residency.controller';
import { ResidencyModule } from './residency/residency.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Residency } from '@app/models/models/users/residency.model';
import { UsersController } from './users/users.controller';
// import { TokensController } from './auth/tokens/tokens.controller';
import { TokensController } from './tokens/tokens.controller';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        POSTGRES_URI: Joi.string().required(),
      }),
      envFilePath: './apps/auth/.env',
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    RmqModule,
    UserModule,
    RolesModule,
    HttpModule,
    ResidencyModule,
    TokensModule
  ],
  controllers: [AuthController, ResidencyController, TokensController],
  providers: [AuthService],
})
export class AuthModule {}
