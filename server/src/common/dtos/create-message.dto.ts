import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { FormDto } from 'src/common/dtos/create-publication.dto';

export class CreateMessageDto {
    @ApiProperty({
        example: 'locality',
        description: 'Радиус проживания',
    })
    @IsOptional()
    @IsString({ message: 'Должно быть строкой' })
    location?: string;

    @ApiProperty({ type: FormDto })
    @ValidateNested()
    @Type(() => FormDto)
    form: FormDto;
}
