import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsInt, IsString, Length } from 'class-validator';
import { Messages } from 'src/common/models/messages/messages.model';

export class NewMessage {
    message: Messages;
    first_name: string;
    last_name: string;
    photo_50: string;
}