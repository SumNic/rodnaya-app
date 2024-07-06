import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class EndReadMessageDto {
  @ApiProperty({
    example: '1',
    description: 'id пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  id: string;

  @ApiProperty({
    example: 'Место жительства',
    description: 'Страна, регион, или район',
  })
  @IsString({ message: 'Должно быть строкой' })
  location: string;

  @ApiProperty({
    example: 'sdfsfsdgggg',
    description: 'Проверка состояния',
  })
  @IsString({ message: 'Должно быть строкой' })
  secret: string;
}