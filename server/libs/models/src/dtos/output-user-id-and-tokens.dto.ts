import { ApiProperty } from '@nestjs/swagger';

export class OutputUserIdAndTokens {
  @ApiProperty({
    example: 1,
    description: 'ID пользователя в базе данных',
  })
  id: number;

  @ApiProperty({
    example: 'aksjwelWe4kjldfksjas',
    description: 'JWT токен',
  })
  token?: string;

  @ApiProperty({
    example: 'aksjwelWe4kjldfksjas',
    description: 'JWT refresh токен',
  })
  refreshToken?: string;
}
