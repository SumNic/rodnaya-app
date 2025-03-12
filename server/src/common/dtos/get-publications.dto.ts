import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class GetPublicationsDto {
    @ApiProperty({
        example: 'Россия',
        description: 'Название страны',
    })
    @IsOptional()
    @IsString({ message: 'Должно быть строкой' })
    country: string;

    @ApiProperty({
        example: 'Чувашия',
        description: 'Название региона',
    })
    @IsOptional()
    @IsString({ message: 'Должно быть строкой' })
    region: string;

    @ApiProperty({
        example: 'Алатырский район',
        description: 'Название района',
    })
    @IsOptional()
    @IsString({ message: 'Должно быть строкой' })
    locality: string;

    @ApiProperty({
        example: '1',
        description: 'Номер страницы',
    })
    @IsString({ message: 'Должно быть строкой' })
    pageNumber: string;
}
