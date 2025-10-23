import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import TelegramBot from 'node-telegram-bot-api';

import TelegramBot = require('node-telegram-bot-api');
import { Residency } from 'src/common/models/users/residency.model';


@Injectable()
export class TelegramService implements OnModuleInit {
    private bot: TelegramBot;

    constructor(private readonly configService: ConfigService) { }

    async onModuleInit() {
        this.bot = new TelegramBot(this.configService.get<string>('BOT_TOKEN')!, { polling: true });

        this.bot.onText(/\/start/, async (msg) => {
            const chatId = msg.chat.id;
            const tgId = msg.from?.id;

            const appUrl = `${this.configService.get<string>('CLIENT_URL')!}/?tg_id=${tgId}`;

            await this.bot.sendMessage(
                chatId,
                'Здравия, Учредитель Родной партии!',
                {
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
                },
            );
        });
    }

    async sendMessage(chatId: number | string, text: string, location: any) {
        const appUrl = `${this.configService.get<string>('CLIENT_URL')!}`;
        try {
            await this.bot.sendMessage(
                chatId,
                `Новое сообщение в ${location}: ${text}`,
                {
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
                },
            );
        } catch (err) {
            console.error('Ошибка при отправке сообщения:', err);
        }
    }
}
