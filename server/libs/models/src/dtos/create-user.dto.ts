import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '12345345',
    description: 'ID VK',
  })
  @IsString({ message: 'Должно быть строкой' })
  vk_id: number;

  @ApiProperty({
    example: 'Имя',
    description: 'Имя пользователя в VK',
  })
  @IsString({ message: 'Должно быть строкой' })
  first_name: string;

  @ApiProperty({
    example: 'Фамилия',
    description: 'Фамилия пользователя в VK',
  })
  @IsString({ message: 'Должно быть строкой' })
  last_name: string; 

  @ApiProperty({
    example: 'Фото для аватара',
    description: 'Фото для аватара в ВК',
  })
  @IsString({ message: 'Должно быть строкой' })
  photo_50: string; 

  @ApiProperty({
    example: 'Фото пользователя',
    description: 'Фото пользователя в ВК',
  })
  @IsString({ message: 'Должно быть строкой' })
  photo_max: string; 

  @ApiProperty({
    example: 'sdrsdf',
    description: 'Секретная строка',
  })
  @IsString({ message: 'Должно быть строкой' })
  secret: string; 
}
