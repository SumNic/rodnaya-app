import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import admin from 'src/common/firebase/firebase-admin';
import { Messages } from 'src/common/models/messages/messages.model';
import { User } from 'src/common/models/users/user.model';
import { Zoom } from 'src/common/models/zoom/zoom.model';
import { DeviceTokensService } from 'src/device-tokens/device-tokens.service';
// import admin from 'firebase-admin';
import { TelegramService } from 'src/telegram/telegram.service';

export interface NotificationMessage {
    senderId?: number;
    title: string;
    body: string;
}

interface SendNotificationsJob {
    users: User[];
    message: NotificationMessage;
    location: string;
}

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
    constructor(
        private readonly telegramService: TelegramService,
        private readonly deviceTokensService: DeviceTokensService,
    ) {
        super(); // обязательно!
    }
    async process(job: Job<SendNotificationsJob>) {
        const { users, message, location } = job.data;

        const tasks = [];

        for (const user of users) {
            const skip = user.id === message.senderId;
            if (skip) continue;

            if (user.tg_id) {
                await this.telegramService.sendMessage(user.tg_id, message.body, location);
            }

            if (Array.isArray(user.userDeviceTokens)) {
                for (const device of user.userDeviceTokens) {
                    if (!device.token) continue;
                    tasks.push(
                        admin
                            .messaging()
                            .send({
                                token: device.token,
                                android: {
                                    notification: {
                                        title: 'Новое сообщение',
                                        body: message.body,
                                        clickAction: 'FCM_PLUGIN_ACTIVITY', // <-- вот здесь
                                        // опционально: звук, иконка
                                        sound: 'default',
                                        channelId: 'default',
                                        icon: 'ic_notification',
                                    },
                                },
                                data: {
                                    route: '/',
                                },
                            })
                            .catch(async (err) => {
                                console.log('SEND ERROR:', err);

                                if (err.code === 'messaging/registration-token-not-registered') {
                                    await this.deviceTokensService.deleteDeviceToken(device.token);
                                    console.log('🔥 Токен удалён как невалидный:', device.token);
                                }
                            }),
                    );
                }
            }
        }

        await Promise.allSettled(tasks);
    }
}
