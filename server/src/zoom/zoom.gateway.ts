import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ZoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // 🔹 При подключении клиента добавляем его в комнаты
    handleConnection(client: Socket) {
        const { userId, groupIds, residency } = client.handshake.auth;

        if (groupIds?.length) {
            groupIds.forEach((id: number) => client.join(`group_${id}`));
        }

        if (residency?.country) client.join(`country_${residency.country}`);
        if (residency?.region) client.join(`region_${residency.region}`);
        if (residency?.locality) client.join(`locality_${residency.locality}`);

        console.log(`Client connected: ${client.id}, rooms:`, client.rooms);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    // 🔹 Универсальный метод для отправки нового Веча
    notifyNewVeche(vech: any) {
        if (vech.groupId) {
            this.server.to(`group_${vech.groupId}`).emit('newVech', vech);
        } else if (vech.locality) {
            this.server.to(`locality_${vech.locality}`).emit('newVech', vech);
        } else if (vech.region) {
            this.server.to(`region_${vech.region}`).emit('newVech', vech);
        } else if (vech.country) {
            this.server.to(`country_${vech.country}`).emit('newVech', vech);
        } else {
            this.server.emit('newVech', vech); // всем, если глобальное
        }
    }

    // 🔹 Если захотим получать события от фронта через socket.emit('newVech')
    //   @SubscribeMessage('newVech')
    //   handleNewVecheFromClient(@MessageBody() vech: any) {
    //     this.notifyNewVeche(vech);
    //   }
}
