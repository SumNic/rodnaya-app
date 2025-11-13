import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdatePublicationDto {
    @ApiProperty({ description: 'ID редактируемого сообщения' })
    @IsInt({ message: 'Должно быть числом' })
    id_message: number;

    @ApiProperty({ description: 'Новый текст сообщения' })
    @IsString({ message: 'Должно быть строкой' })
    message: string;

    @ApiProperty({ description: 'Обновлённые ссылки на видео', required: false, type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    video?: string[];
}
