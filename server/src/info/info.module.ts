import { Module } from '@nestjs/common';
import { InfoService } from './info.service';
import { InfoController } from './info.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Info } from 'src/common/models/info/info.model';

@Module({
    providers: [InfoService],
    controllers: [InfoController],
    imports: [SequelizeModule.forFeature([Info]), AuthModule],
    exports: [InfoService],
})
export class InfoModule {}
