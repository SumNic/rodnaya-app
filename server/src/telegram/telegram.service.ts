import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class TelegramService implements OnModuleInit {
    private bot: TelegramBot;

    constructor(private readonly configService: ConfigService) {}

    async onModuleInit() {
        const webhookUrl = `${this.configService.get<string>('CLIENT_URL')}/api/webhook`;
        this.bot = new TelegramBot(this.configService.get<string>('BOT_TOKEN')!);

        try {
            const result = await this.bot.setWebHook(webhookUrl);
            console.log('Webhook set result:', result);
        } catch (err) {
            console.warn('Не удалось установить вебхук, пропускаем:', err.message);
        }

        this.bot.onText(/\/start/, async (msg) => {
            const chatId = msg.chat.id;
            const tgId = msg.from?.id;

            const appUrl = `${this.configService.get<string>('CLIENT_URL')!}/?tg_id=${tgId}`;

            await this.bot.sendMessage(chatId, 'Здравия, Учредитель Родной партии!', {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '🚀 Перейти в приложение',
                                web_app: { url: appUrl },
                            },
                        ],
                    ],
                },
            });
        });
    }

    async handleUpdate(update: any) {
        this.bot.processUpdate(update);
    }

    async sendMessage(chatId: number | string, text: string, location: any) {
        const appUrl = `${this.configService.get<string>('CLIENT_URL')!}`;
        try {
            await this.bot.sendMessage(chatId, `📝 *Новое сообщение: ${location}*\n` + `${text}\n`, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '🚀 Перейти в приложение',
                                web_app: { url: appUrl },
                            },
                        ],
                    ],
                },
            });
        } catch (err) {
            console.error('Ошибка при отправке сообщения:', err);
        }
    }
}
