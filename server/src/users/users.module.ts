import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Declaration } from 'src/common/models/users/declaration.model';
import { Role } from 'src/common/models/users/role.model';
import { UserRoles } from 'src/common/models/users/user-roles.model';
import { User } from 'src/common/models/users/user.model';
import { DeclarationModule } from 'src/declaration/declaration.module';
import { EndReadMessageModule } from 'src/end-read-message/end-read-message.module';
import { FilesModule } from 'src/files/files.module';
import { MessagesModule } from 'src/messages/messages.module';
import { ResidencyModule } from 'src/residency/residency.module';
import { RolesModule } from 'src/roles/roles.module';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

@Module({
    providers: [UsersService],
    imports: [
        SequelizeModule.forFeature([User, Role, UserRoles, Declaration]),
        RolesModule,
        ResidencyModule,
        DeclarationModule,
        FilesModule,
        AuthModule,
        EndReadMessageModule
    ],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule {}
