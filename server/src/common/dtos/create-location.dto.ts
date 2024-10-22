import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateLocationDto {
    @ApiProperty({
        example: 'Россия',
        description: 'Название страны',
    })
    @IsString({ message: 'Должно быть строкой' })
    country: string;

    @ApiProperty({
        example: 'Чувашия',
        description: 'Название региона',
    })
    @IsString({ message: 'Должно быть строкой' })
    region: string;

    @ApiProperty({
        example: 'Алатырский',
        description: 'Название района',
    })
    @IsString({ message: 'Должно быть строкой' })
    locality: string;
}
