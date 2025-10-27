import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Publications } from 'src/common/models/publications/publications.model';
import { PublicationsController } from 'src/publications/publications.controller';
import { PublicationsGateway } from 'src/publications/publications.gateway';
import { PublicationsService } from 'src/publications/publications.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    providers: [PublicationsService, PublicationsGateway],
    imports: [SequelizeModule.forFeature([Publications]), UsersModule, AuthModule],
    controllers: [PublicationsController],
    exports: [PublicationsService, PublicationsGateway],
})
export class PublicationsModule {}
