import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { User } from 'src/common/models/users/user.model';
import { NotificationMessage } from 'src/queue/notifications.processor';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectQueue('notifications')
        private readonly notificationsQueue: Queue,
    ) {}

    async addNotifications(users: User[], message: NotificationMessage, location: string) {
        await this.notificationsQueue.add(
            'send_notifications',
            { users, message, location },
            {
                attempts: 1,
                backoff: 5000,
                removeOnComplete: true,
            },
        );
    }
}
