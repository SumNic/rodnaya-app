import { Module } from '@nestjs/common';
import { DeclarationService } from './declaration.service';
import { Declaration } from '@app/models/models/users/declaration.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '../users/users.module';
import { DeclarationController } from './declaration.controller';

@Module({
  providers: [DeclarationService],
  imports: [
    SequelizeModule.forFeature([Declaration]),
    UserModule
  ],
  controllers: [DeclarationController],
  exports: [DeclarationService],
})
export class DeclarationModule {}
