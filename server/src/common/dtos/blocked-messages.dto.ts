import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class BlockedMessagesDto {
    @ApiProperty({
        example: 1,
        description: 'id сообщения',
    })
    @IsInt({ message: 'Должно быть числом' })
    id_message: number;

    @ApiProperty({
        example: 1,
        description: 'Индекс действия по отношению к сообщениям',
    })
    @IsInt({ message: 'Должно быть числом' })
    selectedActionIndex: number;
}
