import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UuidDevice {
    @ApiProperty({
        example: 'sdfsdfsd',
        description: 'uuid device',
    })
    @IsString()
    uuid?: string;
}
