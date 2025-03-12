import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
    @ApiProperty({
        example: 1,
        description: 'ID учредителя',
    })
    @IsInt({ message: 'Должно быть числом' })
    id_user: number;

    @ApiProperty({
        example: 'dfgdfg',
        description: 'Секретное слово',
    })
    @IsString({ message: 'Должно быть строкой' })
    secret: string;

    @ApiProperty({
        example: 'locality',
        description: 'Радиус проживания',
    })
    @IsOptional()
    @IsString({ message: 'Должно быть строкой' })
    location?: string;
    
    form: {
        message: string;
        files: any;
    };
}
