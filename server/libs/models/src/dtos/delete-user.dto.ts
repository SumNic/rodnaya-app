import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    example: 1,
    description: 'ID пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  id: number;

  @ApiProperty({
    example: 'sdrsdf',
    description: 'Секретная строка',
  })
  @IsString({ message: 'Должно быть строкой' })
  secret: string; 
}
