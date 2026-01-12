import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

interface SocketContextType {
	socket: Socket | null;
}

export const SocketContext = createContext<SocketContextType | null>(null);

export const useSocketContext = () => {
	const socketContext = useContext(SocketContext);

	if (!socketContext) {
		throw new Error('useSocketContext должен быть использован внутри <SocketContext.Provider>');
	}

	return socketContext;
};
