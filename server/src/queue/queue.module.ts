import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { NotificationsProcessor } from 'src/queue/notifications.processor';
import { NotificationsService } from 'src/queue/notifications.service';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'notifications',
        }),
        TelegramModule,
    ],
    providers: [NotificationsProcessor, NotificationsService],
    exports: [NotificationsService],
})
export class QueueModule {}
