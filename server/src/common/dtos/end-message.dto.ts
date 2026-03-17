import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, ValidateNested } from 'class-validator';
import { CreateLocationDto } from 'src/common/dtos/create-location.dto';

export class EndMessageDto {
    @ApiProperty({ type: CreateLocationDto })
    @ValidateNested()
    @Type(() => CreateLocationDto)
    residency: CreateLocationDto;
}
