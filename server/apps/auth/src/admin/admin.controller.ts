import { FoulSendMessageDto } from '@app/models/dtos/foul-send-message.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdminService } from 'apps/auth/src/admin/admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    /**
     * Получить всех пользователей.
     * @param {number} id - Идентификатор пользователя.
     * @returns Users - Найденный пользователь.
     */
    @MessagePattern('reportViolation')
    async reportViolation(@Payload() dto: FoulSendMessageDto): Promise<string> {
        return await this.adminService.reportViolation(dto);
    }
}
