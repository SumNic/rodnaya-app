import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Messages } from '@app/models/models/messages/messages.model';
import { MessagesController } from './messages.controller';
import { User } from '@app/models';
import { UserModule } from '../users/users.module';
import { ManageMessages } from '@app/models/models/messages/manageMessages.model';
import { EndReadMessage } from '@app/models/models/messages/endReadMessage.model';

@Module({
    providers: [MessagesService],
    imports: [SequelizeModule.forFeature([Messages, ManageMessages, EndReadMessage]), UserModule],
    controllers: [MessagesController],
    exports: [MessagesService],
})
export class MessagesModule {}
