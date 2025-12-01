import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { DeviceTokensModule } from 'src/device-tokens/device-tokens.module';
import { NotificationsProcessor } from 'src/queue/notifications.processor';
import { NotificationsService } from 'src/queue/notifications.service';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'notifications',
        }),
        TelegramModule,
        DeviceTokensModule,
    ],
    providers: [NotificationsProcessor, NotificationsService],
    exports: [NotificationsService],
})
export class QueueModule {}
