import { Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TelegramService } from 'src/telegram/telegram.service';

@ApiTags('Телеграм')
@Controller('api')
export class TelegramController {
    constructor(private readonly telegramService: TelegramService) {}

    @Post('webhook')
    async handleUpdate(@Req() req) {
        await this.telegramService.handleUpdate(req.body);
        return { ok: true };
    }
}
