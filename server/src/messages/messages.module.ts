import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Messages } from 'src/common/models/messages/messages.model';
import { EndReadMessage } from 'src/common/models/messages/endReadMessage.model';
import { MessagesController } from 'src/messages/messages.controller';
import { MessagesService } from 'src/messages/messages.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { EndReadMessageModule } from 'src/end-read-message/end-read-message.module';

@Module({
    providers: [MessagesService],
    imports: [
        SequelizeModule.forFeature([Messages, EndReadMessage]),
        UsersModule,
        AuthModule,
        EndReadMessageModule
        // forwardRef(() => EndReadMessageModule)
    ],
    controllers: [MessagesController],
    exports: [MessagesService],
})
export class MessagesModule {}
