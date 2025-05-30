import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { HOST } from 'src/common/constants/hosts';

@WebSocketGateway({ cors: { origin: `${HOST}` } })
export class GroupsGateway {
    @WebSocketServer() server: Server;
    
    handleConnection(client: any) {
        console.log(`Chat connected: ${client.id}`);
    }

    handleDisconnect(client: any) {
        console.log(`Chat disconnected: ${client.id}`);
    }

    sendMessageWebSocket(event: string, message: any) {
        this.server.emit(event, message);
    }
}
