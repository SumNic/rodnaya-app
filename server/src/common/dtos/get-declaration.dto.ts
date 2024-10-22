import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class GetDeclarationDto {
    @ApiProperty({
        example: 'alkjSedscjgklxcesdf',
        description: 'uuid для создания либо обновления refresh token',
    })
    @IsString({ message: 'uuid: должно быть строкой' })
    declaration: string;
}
