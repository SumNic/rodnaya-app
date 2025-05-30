import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsInt, IsString, Length } from 'class-validator';
import { ChatGroup } from 'src/common/models/groups/chatGroups.model';
import { Messages } from 'src/common/models/messages/messages.model';

export class NewPostToChat {
    groupId: number;
    messagesChat: ChatGroup;
    first_name: string;
    last_name: string;
    photo_50: string;
}