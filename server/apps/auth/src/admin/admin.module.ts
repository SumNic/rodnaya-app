import { FooulSendMessage } from '@app/models/models/admin/foulSendMessage.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminController } from 'apps/auth/src/admin/admin.controller';
import { AdminService } from 'apps/auth/src/admin/admin.service';
import { UserModule } from 'apps/auth/src/users/users.module';

@Module({
    providers: [AdminService],
    imports: [SequelizeModule.forFeature([FooulSendMessage]), UserModule],
    controllers: [AdminController],
    exports: [AdminService],
})
export class AdminModule {}
