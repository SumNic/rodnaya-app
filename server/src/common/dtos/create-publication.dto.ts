// create-publication.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { FileDto } from 'src/common/dtos/file.dto';

export class FormDto {
    @ApiProperty()
    @IsString()
    message: string;

    @ApiProperty({ type: [FileDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Transform(({ value }) => {
        if (typeof value === 'string') return JSON.parse(value);
        return value;
    })
    @Type(() => FileDto)
    files: FileDto[];

    @ApiProperty({ type: [String], required: false })
    @IsArray()
    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') return JSON.parse(value);
        return value;
    })
    video?: string[];
}

export class CreatePublicationDto {
    @ApiProperty()
    @IsNumber()
    id_user: number;

    @ApiProperty()
    @IsString()
    secret: string;

    @ApiProperty({ type: FormDto })
    @ValidateNested()
    @Type(() => FormDto)
    form: FormDto;
}
