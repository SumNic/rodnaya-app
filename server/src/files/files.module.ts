import { forwardRef, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from 'src/files/files.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Files } from 'src/common/models/files/files.model';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    providers: [FilesService],
    controllers: [FilesController],
    imports: [SequelizeModule.forFeature([Files]), forwardRef(() => UsersModule), AuthModule],
    exports: [FilesService],
})
export class FilesModule {}
