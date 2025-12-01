import { Processor, WorkerHost } from '@nestjs/bullmq';
import admin from 'src/common/firebase/firebase-admin';
import { DeviceTokensService } from 'src/device-tokens/device-tokens.service';
// import admin from 'firebase-admin';
import { TelegramService } from 'src/telegram/telegram.service';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
    constructor(
        private readonly telegramService: TelegramService,
        private readonly deviceTokensService: DeviceTokensService,
    ) {
        super(); // обязательно!
    }
    async process(job) {
        const { users, message, location } = job.data;

        const tasks = [];

        for (const user of users) {
            const skip = user.id === user.id;
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
