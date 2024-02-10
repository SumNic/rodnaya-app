import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class RefreshTokensDto {
  @ApiProperty({
    example: 'alkjSedscjgklxcesdf',
    description: 'uuid для создания либо обновления refresh token',
  })
  @IsString({ message: 'uuid: должно быть строкой' })
  uuid?: string;

  @ApiProperty({
    example: 'alkjSedscjgklxcesdf',
    description: 'JWT токен для обновления токенов',
  })
  @IsString({ message: 'refreshToken: должно быть строкой' })
  refreshToken: string;
}
