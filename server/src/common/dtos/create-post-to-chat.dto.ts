import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePostToChatDto {
    @ApiProperty({
        example: 5,
        description: 'ID чата',
    })
    @IsInt({ message: 'Должно быть числом' })
    groupId: number;

    @IsString({ message: 'Должно быть строкой' })
    location: string;
    
    form: {
        message: string;
        files: any;
    };
}
