import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsISO8601, IsInt, IsIn } from 'class-validator';

export class CreateMeetingDto {
    @ApiProperty({
        example: 'Найти ошибку ООП',
        description: 'Тема Веча',
    })
    @IsString({ message: 'Должно быть строкой' })
    topic: string;

    @ApiProperty({
        example: 'Обуждение по поиску ООП',
        description: 'Описание',
    })
    @IsOptional()
    @IsString({ message: 'Должно быть строкой' })
    description?: string;

    @ApiProperty({
        example: '2026-01-07T18:00:00',
        description: 'Дата и время начала Веча (ISO 8601)',
        format: 'date-time',
    })
    @IsISO8601({ strict: true }, { message: 'Дата должна быть в формате ISO 8601' })
    startTime: string;

    @ApiProperty({
        example: 'country',
        description: 'Страна',
    })
    @IsOptional()
    @IsString({ message: 'Должно быть строкой' })
    @IsIn(['world', 'country', 'region', 'locality'])
    location: 'world' | 'country' | 'region' | 'locality';

    @ApiProperty({
        example: 5,
        description: 'ID группы',
    })
    @IsOptional()
    @IsInt({ message: 'Должно быть числом' })
    groupId: number;
}
