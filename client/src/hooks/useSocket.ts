import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { HOST } from "../utils/consts";

export const useSocket = () => {
    const socketRef = useRef<null | Socket>(null);

    useEffect(() => {
        // Инициализация соединения
        socketRef.current = io(HOST);

        socketRef.current.on('connect', () => {
            console.log('Socket.IO connection established');
        });

        socketRef.current.on('disconnect', () => {
            console.log('Socket.IO connection disconnected');
        });

        // Очистка соединения при размонтировании компонента
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    return {
        socket: socketRef.current,
    };
};