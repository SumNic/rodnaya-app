import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Messages } from '@app/models/models/messages/messages.model';
import { MessagesController } from './messages.controller';
import { User } from '@app/models';
import { UserModule } from '../users/users.module';

@Module({
  providers: [MessagesService],
  imports: [
    SequelizeModule.forFeature([Messages]),
    UserModule
  ],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
