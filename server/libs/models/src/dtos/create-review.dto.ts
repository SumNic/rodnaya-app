import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 'Lorem ipsum',
    description: 'Текст отзыва',
  })
  @IsString({ message: 'text Должно быть строкой' })
  text: string;

  @ApiProperty({
    example: 1,
    description: 'ID пользователя, который написал отзыв',
  })
  @IsInt({ message: 'user_id Должно быть целым числом' })
  user_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID фильма на который написали отзыв',
  })
  @IsInt({ message: 'film_id Должно быть целым числом' })
  film_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID родительского коментария',
  })
  @IsOptional()
  @IsInt({ message: 'parent_id Должно быть целым числом' })
  parent?: number;
}
