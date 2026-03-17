import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateLastReadDto {
    @ApiProperty({ example: 1, description: 'ID группы' })
    @IsInt()
    @Min(1)
    groupId: number;

    @ApiProperty({ example: 123, description: 'ID последнего прочитанного сообщения' })
    @IsInt()
    @Min(0)
    lastReadPostId: number;
}
