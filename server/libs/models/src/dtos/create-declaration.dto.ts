import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNumber, IsString, Length } from 'class-validator';

export class CreateDeclarationDto {
  @ApiProperty({
    example: 1,
    description: 'id пользователя',
  })
  @IsInt({ message: 'Должно быть числом' })
  id: number;

  @ApiProperty({
    example: 'Декларация',
    description: 'Декларация Родной партии',
  })
  @IsString({ message: 'Должно быть строкой' })
  declaration: string;

  @ApiProperty({
    example: 'sdfsfsdgggg',
    description: 'Проверка состояния',
  })
  @IsString({ message: 'Должно быть строкой' })
  secret: string;
}