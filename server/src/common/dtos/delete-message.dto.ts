import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class DeleteMessageDto {
    @ApiProperty({ description: 'ID удаляемого сообщения' })
    @IsInt({ message: 'Должно быть числом' })
    id_message: number;
}
