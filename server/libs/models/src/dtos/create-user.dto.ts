import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '12345345',
    description: 'ID VK',
  })
  @IsString({ message: 'Должно быть строкой' })
  vk_id: string;

  @ApiProperty({
    example: 'sdfsdfsd',
    description: 'uuid VK',
  })
  @IsString({ message: 'Должно быть строкой' })
  uuid: string;

  @ApiProperty({
    example: 'sdfsdfsdf',
    description: 'Silent token',
  })
  @IsString({ message: 'Должно быть строкой' })
  token: string; 
}
