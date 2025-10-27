import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class RespIdNoReadMessagesDto {
    @ApiProperty({
        example: 1,
        description: 'Название локации',
    })
    @IsString({ message: 'Должно быть строкой' })
    location: string;

    @ApiProperty({
        example: 1,
        description: 'Id непрочитанных сообщений',
    })
    @IsInt({ message: 'Должно быть числом' })
    id: number;
}
