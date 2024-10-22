import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, ArrayNotEmpty, IsInt } from 'class-validator';

export class FoulSendMessageDto {
    @ApiProperty({
        example: 1,
        description: 'id уборщика',
    })
    @IsInt({ message: 'Должно быть числом' })
    id_cleaner: number;

    @ApiProperty({
        example: 1,
        description: 'id сообщения нарушающего правила',
    })
    @IsInt({ message: 'Должно быть числом' })
    id_foul_message: number;

    @ApiProperty({
        example: [1, 2, 3],
        description: 'Список индексов нарушенных правил',
    })
    @ArrayNotEmpty({ message: 'Список нарушенных правил не может быть пустым' })
    @ArrayMinSize(1, { message: 'Список нарушенных правил должен содержать хотя бы одно значение' })
    selectedRules: number[];

    @ApiProperty({
        example: 1,
        description: 'Действие с сообщением, нарушающим правила',
    })
    @IsInt({ message: 'Должно быть числом' })
    selectedActionWithFoul: number;

    @ApiProperty({
        example: 1,
        description: 'Выбранное наказание для нарушителя правил',
    })
    @IsInt({ message: 'Должно быть числом' })
    selectedPunishment: number;
}
