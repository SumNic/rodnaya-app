import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class OutputUserTokens {
  @ApiProperty({
    example: 'aksjwelWe4kjldfksjas',
    description: 'JWT токен',
  })
  token: string;

  @ApiProperty({
    example: 'aksjwelWe4kjldfksjas',
    description: 'JWT refresh токен',
  })
  // refreshToken: string;
  user: CreateUserDto;

}
