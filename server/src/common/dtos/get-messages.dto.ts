import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetMessagesDto {
    @ApiProperty({
        example: 1,
        description: 'ID первого сообщения',
    })
    @IsString({ message: 'Должно быть строкой' })
    pageNumber: string;

    @ApiProperty({
        example: 'locality',
        description: 'Радиус проживания',
    })
    @IsString({ message: 'Должно быть строкой' })
    location: string;
}
