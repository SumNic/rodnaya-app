import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLocationDto {
    @ApiProperty({
        example: 'Мир',
        description: 'Название планеты',
    })
    @IsString({ message: 'Должно быть строкой' })
    world?: string;

    @ApiProperty({
        example: 'Россия',
        description: 'Название страны',
    })
    @IsString({ message: 'Должно быть строкой' })
    country?: string;

    @ApiProperty({
        example: 'Чувашия',
        description: 'Название региона',
    })
    @IsString({ message: 'Должно быть строкой' })
    region?: string;

    @ApiProperty({
        example: 'Алатырский',
        description: 'Название района',
    })
    @IsString({ message: 'Должно быть строкой' })
    locality?: string;
}
