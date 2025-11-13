import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsInt, IsString, Length } from 'class-validator';
import { GroupMessage } from 'src/common/models/groups/groupMessage';
import { Messages } from 'src/common/models/messages/messages.model';

export class NewGroupMessage {
    groupId: number;
    messagesChat: GroupMessage;
    first_name: string;
    last_name: string;
    photo_50: string;
}
