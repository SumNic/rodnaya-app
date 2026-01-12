import { Module } from '@nestjs/common';
import { ZoomController } from './zoom.controller';
import { ZoomService } from './zoom.service';
import { UsersModule } from 'src/users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Zoom } from 'src/common/models/zoom/zoom.model';
import { AuthModule } from 'src/auth/auth.module';
import { ZoomView } from 'src/common/models/zoom/zoom_views.model';
import { TelegramModule } from 'src/telegram/telegram.module';
import { QueueModule } from 'src/queue/queue.module';
import { MessagesGateway } from 'src/messages/messages.gateway';
import { GroupsModule } from 'src/groups/groups.module';
import { ZoomGateway } from 'src/zoom/zoom.gateway';

@Module({
    controllers: [ZoomController],
    providers: [ZoomService, ZoomGateway],
    imports: [SequelizeModule.forFeature([Zoom, ZoomView]), AuthModule, UsersModule, TelegramModule, QueueModule, GroupsModule],
    // exports: [MessagesService, MessagesGateway],
})
export class ZoomModule {}
