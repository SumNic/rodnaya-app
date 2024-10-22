import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FooulSendMessage } from 'src/common/models/admin/foulSendMessage.model';
import { UsersModule } from 'src/users/users.module';
import { AdminController } from 'src/admin/admin.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    providers: [AdminService],
    imports: [SequelizeModule.forFeature([FooulSendMessage]), UsersModule, AuthModule],
    controllers: [AdminController],
    exports: [AdminService],
})
export class AdminModule {}
