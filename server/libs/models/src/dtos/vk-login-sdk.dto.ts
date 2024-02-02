import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class VkLoginSdkDto {
  @ApiProperty({
    example: 'QGvH-8oEHe7seNqn5',
    description: 'uuid VK',
  })
  @IsString({ message: 'Должно быть строкой' })
  uuid: string;

  @ApiProperty({
    example: 'Q-w-rLTxyi02R206ST3-lJi7siJazRnjIw3lU6ISIotanzuIibpSqzwONRZb-gSyC1OeFUd2uBzGX2QWPxMoPcPtA8EqnPp77NjnxZ2Vthx50nSeJ1D-plvRXMkv0JJofSMYknato7__m4UXYnak9QmMbnmRym0chJpW0im3uyyvzDehy2vNYNgMv4ZdB_lvrpxRh6HDyZugVFVTBH-B68XuHg-xGAB0OtRTjWd4yP_atlryHaeZHH5kcyPZQWsi2jhS2iawbRXqccrmJF0DurCcLG2Yw4UbzHfdV0DBOlhhtd86os81ZgMrSzTtLx1utIvWu9-EdvGIqZBOXteZS-uRLQzZKL86_08IBKfC0gaDSAWtgQjphXfC7EJCRLZdZB7T3LLc2Ce4jeq3Y4JzNuAEMA',
    description: 'Токен доступа VK',
  })
  @IsString({ message: 'Должно быть строкой' })
  token: string;
}