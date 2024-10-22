import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import * as cookieParser from 'cookie-parser';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { TokensModule } from 'src/tokens/tokens.module';
import { UsersModule } from 'src/users/users.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Module({
    providers: [AuthService],
    controllers: [AuthController],
    imports: [
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
        forwardRef(() => UsersModule),
        TokensModule,
    ],
    exports: [AuthService],
})
export class AuthModule {}
