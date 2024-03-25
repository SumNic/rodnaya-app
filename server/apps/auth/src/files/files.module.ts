import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { Files } from '@app/models/models/files/files.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '../users/users.module';

@Module({
  providers: [FilesService],
  controllers: [FilesController],
  imports: [
    SequelizeModule.forFeature([Files]),
    UserModule
  ],
  exports: [FilesService]
})
export class FilesModule {}
