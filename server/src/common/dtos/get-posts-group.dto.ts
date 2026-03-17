import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Direction } from 'src/common/types/types';

export class GetPostsGroupDto {
    @ApiProperty({
        example: 1,
        description: 'ID группы',
    })
    @IsInt({ message: 'Должно быть строкой' })
    groupId: number;

    @ApiProperty({
        example: 25,
        description: 'id сообщения, от которого грузим',
        required: false,
    })
    @IsOptional()
    @IsInt({ message: 'Должно быть числом' })
    cursor?: number;

    @ApiProperty({
        example: Direction.BEFORE,
        enum: Direction,
        description: 'Направление прокрутки',
        required: false,
    })
    @IsOptional()
    @IsEnum(Direction, { message: 'Может быть BEFOR или AFTER' })
    direction?: Direction;

    @ApiProperty({
        example: 25,
        description: 'Лимит сообщений при загруке',
        required: false,
    })
    @IsOptional()
    @IsInt({ message: 'Должно быть числом' })
    limit?: number;
}
