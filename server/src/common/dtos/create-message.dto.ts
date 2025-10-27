import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
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
