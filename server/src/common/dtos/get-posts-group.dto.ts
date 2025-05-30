import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetPostsGroupDto {
    @ApiProperty({
        example: 1,
        description: 'ID группы',
    })
    @IsString({ message: 'Должно быть строкой' })
    groupId: string;

    @ApiProperty({
        example: 1,
        description: 'Номер страницы',
    })
    @IsString({ message: 'Должно быть строкой' })
    pageNumber: string;
}
