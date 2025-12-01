import { Processor, WorkerHost } from '@nestjs/bullmq';
import admin from 'src/common/firebase/firebase-admin';
// import admin from 'firebase-admin';
import { TelegramService } from 'src/telegram/telegram.service';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
    constructor(private readonly telegramService: TelegramService) {
        super(); // обязательно!
    }
    async process(job) {
        const { users, message, location } = job.data;

        const tasks = [];

        for (const user of users) {
            const skip = user.id !== user.id;
            if (skip) continue;

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
                                        body: message,
                                        clickAction: 'FCM_PLUGIN_ACTIVITY', // <-- вот здесь
                                        // опционально: звук, иконка
                                        sound: 'default',
                                        channelId: 'default',
                                        icon: 'ic_notification',
                                    },
                                },
                                data: {
                                    route: '/messages/locality',
                                },
                            })
                            .catch((err) => console.log('SEND ERROR:', err)),
                    );
                }
            }
        }

        await Promise.allSettled(tasks);
    }
}
