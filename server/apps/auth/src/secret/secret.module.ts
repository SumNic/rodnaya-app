import { Module } from '@nestjs/common';
import { SecretService } from './secret.service';
import { Secret } from '@app/models/models/users/secret.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '../users/users.module';
import { SecretController } from './secret.controller';

@Module({
  providers: [SecretService],
  imports: [
    SequelizeModule.forFeature([Secret]),
    // UserModule
  ],
  exports: [SecretService],
  controllers: [SecretController],
})
export class SecretModule {}