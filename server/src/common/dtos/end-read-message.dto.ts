import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class EndReadMessageDto {
    @ApiProperty({
        example: 1,
        description: 'id сообщения',
    })
    @IsInt({ message: 'Должно быть числом' })
    id_message: number;

    @ApiProperty({
        example: 'Место жительства',
        description: 'Страна, регион, или район',
    })
    @IsString({ message: 'Должно быть строкой' })
    location: string;
}
