import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, ValidateNested } from 'class-validator';
import { CreateLocationDto } from 'src/common/dtos/create-location.dto';

export class EndMessageDto {
    @ApiProperty({
        example: '1',
        description: 'id пользователя',
    })
    @IsString({ message: 'Должно быть строкой' })
    id: string;

    @ApiProperty({
        example: 'sdfsfsdgggg',
        description: 'Проверка состояния',
    })
    @IsString({ message: 'Должно быть строкой' })
    secret: string;

    @ApiProperty({ type: CreateLocationDto })
    @ValidateNested()
    @Type(() => CreateLocationDto)
    residency: CreateLocationDto;
}
