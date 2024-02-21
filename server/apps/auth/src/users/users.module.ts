import { Role, User, UserRoles } from '@app/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesModule } from '../roles/roles.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Declaration } from '@app/models/models/users/declaration.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Role, UserRoles, Declaration]), RolesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
