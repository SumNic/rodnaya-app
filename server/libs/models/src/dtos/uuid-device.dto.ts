import { ApiProperty } from '@nestjs/swagger';

export class UuidDevice {
  @ApiProperty({
    example: 'sdfsdfsd',
    description: 'uuid device',
  })
  uuid: string;
}
