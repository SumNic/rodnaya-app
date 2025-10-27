import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGroupDto {
    @ApiProperty({
        example: 'Поиск ООП',
        description: 'Название группы',
    })
    @IsString({ message: 'Должно быть строкой' })
    groupName: string;

    @ApiProperty({
        example: 'Совместными усилиями определить ООП',
        description: 'Задача группы',
    })
    @IsString({ message: 'Должно быть строкой' })
    groupTask: string;

    @ApiProperty({
        example: 'Район',
        description: 'Локация группы',
    })
    @IsString({ message: 'Должно быть строкой' })
    location: string;
}
