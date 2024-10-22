import { forwardRef, Module } from '@nestjs/common';
import { DeclarationService } from './declaration.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Declaration } from 'src/common/models/users/declaration.model';
import { UsersModule } from 'src/users/users.module';
import { DeclarationController } from 'src/declaration/declaration.controller';

@Module({
    providers: [DeclarationService],
    imports: [SequelizeModule.forFeature([Declaration]), forwardRef(() => UsersModule)],
    controllers: [DeclarationController],
    exports: [DeclarationService],
})
export class DeclarationModule {}
