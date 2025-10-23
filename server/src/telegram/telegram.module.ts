import { Module } from '@nestjs/common';
import { TelegramService } from 'src/telegram/telegram.service';

@Module({
    providers: [TelegramService],
    exports: [TelegramService],
})
export class TelegramModule {}
