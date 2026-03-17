import { useEffect, useRef, useState } from 'react';
import { useStore } from './useStore.hook';
import { MessageWebsocketResponse } from '../models/response/MessageWebsocketResponse';
import { Socket } from 'socket.io-client';

export const useMessage = (socket: Socket | null) => {
	const [isLoading, setIsLoading] = useState(false);

	const [isLoadMessages, setIsLoadMessages] = useState(false);
	const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);
	const [isLoadingNext, setIsLoadingNext] = useState(false);
	const [messageDataSocket, setMessageDataSocket] = useState<MessageWebsocketResponse>();
	const [isScrollTop, setIsScrollTop] = useState(false);

	const messagesContainerRef = useRef<HTMLDivElement | null>(null);

	const { store } = useStore();

	const { isAuth, user } = store.authStore;
	const { getCountNoReadMessages, getLastReadMessageId, arrCountNoReadMessages, updateArrCountNoReadMessages } =
		store.messageStore;

	useEffect(() => {
		if (isAuth) {
			getCountNoReadMessages(user.residency);
			getLastReadMessageId(user.residency);
		}
	}, [store.authStore.isAuth, getCountNoReadMessages, getLastReadMessageId]);

	useEffect(() => {
		const handleNewMessage = (data: MessageWebsocketResponse) => {
			if (!data) return;
			setMessageDataSocket(data);
		};

		socket?.on('new_message', handleNewMessage);

		// Очистка при размонтировании
		return () => {
			socket?.off('new_message', handleNewMessage);
		};
	}, [socket]);

	useEffect(() => {
		if (arrCountNoReadMessages?.length && messageDataSocket) {
			const prevCountNoReadMessages = arrCountNoReadMessages.find(
				(elem) => elem.location === messageDataSocket.resydency
			);
			if (prevCountNoReadMessages && store.authStore.user.id !== messageDataSocket.id_user) {
				updateArrCountNoReadMessages(messageDataSocket.resydency, prevCountNoReadMessages.count + 1);
			}
		}
	}, [messageDataSocket, arrCountNoReadMessages]);

	return {
		isLoading,
		setIsLoading,
		isLoadMessages,
		setIsLoadMessages,
		isLoadingPrevious,
		setIsLoadingPrevious,
		isLoadingNext,
		setIsLoadingNext,
		messageDataSocket,
		setMessageDataSocket,
		isScrollTop,
		setIsScrollTop,
		messagesContainerRef,
	};
};
