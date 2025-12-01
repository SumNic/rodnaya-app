import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { UserDeviceToken } from 'src/common/models/users/userDeviceToken.model';
import { DeviceTokensController } from 'src/device-tokens/device-tokens.controller';
import { DeviceTokensService } from 'src/device-tokens/device-tokens.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    providers: [DeviceTokensService],
    imports: [SequelizeModule.forFeature([UserDeviceToken]), UsersModule, AuthModule],
    controllers: [DeviceTokensController],
    exports: [DeviceTokensService],
})
export class DeviceTokensModule {}
