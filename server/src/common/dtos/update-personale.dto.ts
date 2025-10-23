import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class UpdatePersonaleDto {
    @ApiProperty({
        example: 1,
        description: 'id пользователя',
    })
    @IsInt({ message: 'Должно быть числом' })
    user_id: number;

    @ApiProperty({
        example: 'Имя',
        description: 'Новое имя пользователя',
    })
    @IsString({ message: 'Должно быть строкой' })
    first_name?: string;

    @ApiProperty({
        example: 'Фамилия',
        description: 'Новая фамилия пользователя',
    })
    @IsString({ message: 'Должно быть строкой' })
    last_name?: string;

    @ApiProperty({
        example: 12342332,
        description: 'id пользователя в телеграм',
    })
    @IsInt({ message: 'Должно быть числом' })
    tg_id?: number;
}
