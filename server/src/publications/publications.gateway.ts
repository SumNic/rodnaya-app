import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { HOST } from 'src/common/constants/hosts';

@WebSocketGateway({ cors: { origin: `${HOST}` } })
export class PublicationsGateway {
    @WebSocketServer() server: Server;
    
    handleConnection(client: any) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: any) {
        console.log(`Client disconnected: ${client.id}`);
    }

    sendPublicationWebSocket(event: string, message: any) {
        this.server.emit(event, message);
    }
}
