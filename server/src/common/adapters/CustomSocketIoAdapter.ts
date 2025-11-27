import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { ServerOptions } from 'socket.io';
import { ConfigService } from '@nestjs/config';

export class CustomSocketIoAdapter extends IoAdapter {
    constructor(
        private app: INestApplication,
        private configService: ConfigService,
    ) {
        super(app);
    }

    createIOServer(port: number, options?: ServerOptions) {
        const corsOptions: ServerOptions['cors'] = {
            origin: [this.configService.get('CLIENT_URL'), 'vk54345890://', 'http://localhost', 'capacitor://localhost'],
            methods: ['GET', 'POST'],
            credentials: true,
        };

        return super.createIOServer(port, { ...options, cors: corsOptions });
    }
}
