import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { FormDto } from 'src/common/dtos/create-publication.dto';

export class CreatePostToChatDto {
    @ApiProperty({
        example: 5,
        description: 'ID чата',
    })
    @IsInt({ message: 'Должно быть числом' })
    groupId: number;

    @ApiProperty()
    @IsString({ message: 'Должно быть строкой' })
    location: string;

    @ApiProperty({ type: FormDto })
    @ValidateNested()
    @Type(() => FormDto)
    form: FormDto;
}
