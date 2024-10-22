import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EndReadMessage } from '../common/models/messages/endReadMessage.model';
import { EndReadMessageService } from './end-read-message.service';
import { Messages } from 'src/common/models/messages/messages.model';

@Module({
    imports: [SequelizeModule.forFeature([EndReadMessage, Messages])],
    providers: [EndReadMessageService],
    exports: [EndReadMessageService],
})
export class EndReadMessageModule {}
