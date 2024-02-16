import { ApiProperty } from '@nestjs/swagger';
import { User } from '../models/users/user.model';

export class OutputUserAndTokens {
  @ApiProperty({
    example: 1,
    description: 'Пользователь сайта',
  })
  user: User;

  @ApiProperty({
    example: 'sdfsdf',
    description: 'uuid',
  })
  secret?: string;

  @ApiProperty({
    example: 'aksjwelWe4kjldfksjas',
    description: 'JWT токен',
  })
  token: string;

  @ApiProperty({
    example: 'aksjwelWe4kjldfksjas',
    description: 'JWT refresh токен',
  })
  refreshToken: string;
}
