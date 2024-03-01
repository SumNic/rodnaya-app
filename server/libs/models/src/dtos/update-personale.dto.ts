import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNumber, IsString, Length } from 'class-validator';

export class UpdatePersonaleDto {
  @ApiProperty({
    example: 1,
    description: 'id пользователя',
  })
  @IsInt({ message: 'Должно быть числом' })
  user_id: number;

  @ApiProperty({
    example: 'Имя',
    description: 'Новое имя пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  first_name: string;

  @ApiProperty({
    example: 'Фамилия',
    description: 'Новая фамилия пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  last_name: string;
}