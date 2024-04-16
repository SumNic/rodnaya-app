import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNumber, IsString, Length } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 1,
    description: 'ID учредителя',
  })
  @IsInt({ message: 'Должно быть числом' })
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

  // @ApiProperty({
  //   example: 'Сообщение',
  //   description: 'Текст сообщения',
  // })
  form : { 
    message: string, 
    files: any;
  };


  
}
