import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNumber, IsString, Length } from 'class-validator';

export class CreateResidencyDto {
    @ApiProperty({
        example: 1,
        description: 'id пользователя',
    })
    @IsInt({ message: 'id Должно быть числом' })
    id: number;

    @ApiProperty({
        example: 'Россия',
        description: 'Название страны',
    })
    @IsString({ message: 'country Должно быть строкой' })
    country: string;

    @ApiProperty({
        example: 'Чувашия',
        description: 'Название региона',
    })
    @IsString({ message: 'region Должно быть строкой' })
    region: string;

    @ApiProperty({
        example: 'Алатырский',
        description: 'Название района',
    })
    @IsString({ message: 'locality Должно быть строкой' })
    locality: string;

    @ApiProperty({
        example: 'sdfsfsdgggg',
        description: 'Проверка состояния',
    })
    @IsString({ message: 'secret Должно быть строкой' })
    secret?: string;
}
