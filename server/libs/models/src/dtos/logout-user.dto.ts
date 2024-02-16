import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsInt, IsString, Length } from 'class-validator';

export class LogoutUserDto {
  @ApiProperty({
    example: 1,
    description: 'ID user',
  })
  @IsInt({ message: 'Должно быть целым числом' })
  id: number;

  @ApiProperty({
    example: 'sdfasdfvcvd',
    description: 'uuid for refreshToken',
  })
  @IsString({ message: 'Должно быть строкой' })
  uuid: string | null;

  @ApiProperty({
    example: 'true',
    description: 'Exit for all devices',
  })
  @IsBoolean({ message: 'Должно быть true or false' })
  allDeviceExit: boolean;
}