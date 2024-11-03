import { io, Socket } from "socket.io-client";
import { HOST } from "../utils/consts";

class SocketApi {
    static socket: null | Socket = null;

    // Метод для инициализации WebSocket соединения
    static createConnection(): void {
            
        this.socket = io(`${HOST}/ws`);
        
        this.socket.on('connect', () => {
            console.log('Socket.IO connection established');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket.IO connection disconnected');
        });
    }
}

export default SocketApi;
