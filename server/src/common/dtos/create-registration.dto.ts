import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNumber, IsString, Length } from 'class-validator';

export class CreateRegistrationDto {
    @ApiProperty({
        example: 1,
        description: 'id пользователя',
    })
    @IsInt({ message: 'Должно быть числом' })
    id: number;

    @ApiProperty({
        example: 'sdfsfsdgggg',
        description: 'Проверка состояния',
    })
    @IsString({ message: 'Должно быть строкой' })
    secret?: string;

    @ApiProperty({
        example: 'sdfsfsdgggg',
        description: 'uuid для используемого устройства',
    })
    @IsString({ message: 'Должно быть строкой' })
    uuid?: string;
}
