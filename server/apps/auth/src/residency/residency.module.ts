import { ResidencyUser } from '@app/models/models/users/residency.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResidencyController } from './residency.controller';
import { ResidencyService } from './residency.service';

@Module({
  providers: [ResidencyService],

  imports: [
    SequelizeModule.forFeature([ResidencyUser])
  ],
  controllers: [ResidencyController],
  exports: [ResidencyService],
})
export class ResidencyModule {}
