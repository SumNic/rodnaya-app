import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class GetMessagesDto {
  @ApiProperty({
    example: 1,
    description: 'ID учредителя',
  })
  @IsString({ message: 'Должно быть числом' })
  id_user: number;

  @ApiProperty({
    example: 'dfgdfg',
    description: 'Секретное слово',
  })
  @IsString({ message: 'Должно быть строкой' })
  secret: string;

  @ApiProperty({
    example: 'locality',
    description: 'Радиус проживания',
  })
  @IsString({ message: 'Должно быть строкой' })
  location: string;
}
