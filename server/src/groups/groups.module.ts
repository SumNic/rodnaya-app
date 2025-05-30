import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { ChatGroup } from 'src/common/models/groups/chatGroups.model';
import { Group } from 'src/common/models/groups/groups.model';
import { LastReadPostChat } from 'src/common/models/groups/lastReadPostChat.model';
import { GroupsController } from 'src/groups/groups.controller';
import { GroupsGateway } from 'src/groups/groups.gateway';
import { GroupsService } from 'src/groups/groups.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    providers: [GroupsService, GroupsGateway],
    imports: [
        SequelizeModule.forFeature([Group, ChatGroup, LastReadPostChat]),
        UsersModule,
        AuthModule,
    ],
    controllers: [GroupsController],
    exports: [GroupsService, GroupsGateway],
})
export class GroupsModule {}
