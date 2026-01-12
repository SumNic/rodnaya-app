import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { HOST } from '../utils/consts';

interface SocketAuth {
	userId: number;
	groupIds: number[];
	residency: any;
}

export const useSocket = (auth: SocketAuth | null) => {
	const socketRef = useRef<Socket | null>(null);
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		if (!auth) return;

		// ⛔ если сокет уже есть — ничего не делаем
		if (socketRef.current) return;

		const s = io(HOST, { auth });

		socketRef.current = s;
		setSocket(s);

		s.on('connect', () => console.log('Socket connected'));
		s.on('disconnect', () => console.log('Socket disconnected'));

		// ❗ не отключаем при размонтировании App
	}, [auth?.userId]);

	return {
		socket,
	};
};
