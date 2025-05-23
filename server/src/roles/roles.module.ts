import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from 'src/common/models/users/role.model';
import { User } from 'src/common/models/users/user.model';
import { UserRoles } from 'src/common/models/users/user-roles.model';
import { RolesController } from 'src/roles/roles.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    providers: [RolesService],
    imports: [SequelizeModule.forFeature([Role, User, UserRoles]), AuthModule],
    controllers: [RolesController],
    exports: [RolesService],
})
export class RolesModule {}
