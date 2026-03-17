import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
    @ApiProperty({
        example: 'Мир',
        description: 'Название планеты',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Должно быть строкой' })
    world?: string;

    @ApiProperty({
        example: 'Россия',
        description: 'Название страны',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Должно быть строкой' })
    country?: string;

    @ApiProperty({
        example: 'Чувашия',
        description: 'Название региона',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Должно быть строкой' })
    region?: string;

    @ApiProperty({
        example: 'Алатырский',
        description: 'Название района',
        required: false,
    })
    @IsOptional()
    @IsString({ message: 'Должно быть строкой' })
    locality?: string;
}
