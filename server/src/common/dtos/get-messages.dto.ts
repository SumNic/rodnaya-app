import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsBooleanString, IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class GetMessagesDto {
    @ApiProperty({
        example: 1,
        description: 'ID учредителя',
    })
    @IsString({ message: 'Должно быть строкой' })
    id: string;

    @ApiProperty({
        example: 1,
        description: 'ID первого сообщения',
    })
    @IsString({ message: 'Должно быть строкой' })
    pageNumber: string;

    @ApiProperty({
        example: 'dfgdfg',
        description: 'Секретное слово',
    })
    @IsString({ message: 'Должно быть строкой' })
    secret: string;

    @ApiProperty({
        example: 'locality',
        description: 'Радиус проживания',
    })
    @IsString({ message: 'Должно быть строкой' })
    location: string;
}
