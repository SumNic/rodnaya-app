import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Messages } from 'src/common/models/messages/messages.model';
import { EndReadMessage } from 'src/common/models/messages/endReadMessage.model';
import { MessagesController } from 'src/messages/messages.controller';
import { MessagesService } from 'src/messages/messages.service';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { EndReadMessageModule } from 'src/end-read-message/end-read-message.module';
import { MessagesGateway } from 'src/messages/messages.gateway';
import { TelegramModule } from 'src/telegram/telegram.module';
import { QueueModule } from 'src/queue/queue.module';

@Module({
    providers: [MessagesService, MessagesGateway],
    imports: [
        SequelizeModule.forFeature([Messages, EndReadMessage]),
        UsersModule,
        AuthModule,
        EndReadMessageModule,
        TelegramModule,
        QueueModule,
    ],
    controllers: [MessagesController],
    exports: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
