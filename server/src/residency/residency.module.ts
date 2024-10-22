import { forwardRef, Module } from '@nestjs/common';
import { ResidencyService } from './residency.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Residency } from 'src/common/models/users/residency.model';
import { Token } from 'src/common/models/users/tokens.model';
import { UsersModule } from 'src/users/users.module';
import { ResidencyController } from 'src/residency/residency.controller';

@Module({
    providers: [ResidencyService],
    imports: [SequelizeModule.forFeature([Residency, Token]), forwardRef(() => UsersModule)],
    controllers: [ResidencyController],
    exports: [ResidencyService],
})
export class ResidencyModule {}
