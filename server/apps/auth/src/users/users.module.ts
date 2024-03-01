import { Role, User, UserRoles } from '@app/models';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesModule } from '../roles/roles.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Declaration } from '@app/models/models/users/declaration.model';
import { Secret } from '@app/models/models/users/secret.model';
import { SecretModule } from '../secret/secret.module';

@Module({
  imports: [SequelizeModule.forFeature([User, Role, UserRoles, Declaration, Secret]), RolesModule, SecretModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
