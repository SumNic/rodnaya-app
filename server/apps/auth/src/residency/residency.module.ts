import { Residency } from '@app/models/models/users/residency.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResidencyController } from './residency.controller';
import { ResidencyService } from './residency.service';
import { Token } from '@app/models/models/users/tokens.model';
import { UserModule } from '../users/users.module';

@Module({
  providers: [ResidencyService],

  imports: [
    SequelizeModule.forFeature([Residency, Token]),
    UserModule
  ],
  controllers: [ResidencyController],
  exports: [ResidencyService],
})
export class ResidencyModule {}
