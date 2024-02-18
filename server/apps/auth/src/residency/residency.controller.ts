import { Controller } from '@nestjs/common';
import { ResidencyService } from './residency.service';
import { MessagePattern } from '@nestjs/microservices';
import { Residency } from '@app/models';

@Controller('residency')
export class ResidencyController { 

    constructor(private readonly residencyService: ResidencyService,
    ) {}

    /**
   * Получить всех пользователей.
   * @param {number} id - Идентификатор пользователя.
   * @returns Users - Найденный пользователь.
   */
  @MessagePattern('getAllResydencys')
  async getAllResydencys(): Promise<Residency[]> {
    return await this.residencyService.getAllResydencys();
  }
 }
