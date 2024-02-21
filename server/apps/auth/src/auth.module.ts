import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule, RmqModule } from '@app/common';
import { RolesModule } from './roles/roles.module';
import { HttpModule } from '@nestjs/axios';
import { ResidencyController } from './residency/residency.controller';
import { ResidencyModule } from './residency/residency.module';
import { TokensController } from './tokens/tokens.controller';
import { TokensModule } from './tokens/tokens.module';
import cookieParser from 'cookie-parser';
import { UsersController } from './users/users.controller';
import { UserModule } from './users/users.module';

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
        configure(consumer: MiddlewareConsumer) {
          consumer.apply(cookieParser()).forRoutes('*');
        }
        // consumer: {
        //   apply(req, res: Response, next) {
        //     res.cookie('refreshToken', req.refreshToken);
        //     next();
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    RmqModule,
    UserModule,
    RolesModule,
    HttpModule,
    ResidencyModule,
    TokensModule,
  ],
  controllers: [AuthController, ResidencyController, TokensController, UsersController],
  providers: [AuthService],
})
export class AuthModule {}
