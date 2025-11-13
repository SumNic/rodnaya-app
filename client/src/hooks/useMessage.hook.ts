import { useEffect, useRef, useState } from 'react';
import { useStore } from './useStore.hook';
import { MessageWebsocketResponse } from '../models/response/MessageWebsocketResponse';

export const useMessage = () => {
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
			getCountNoReadMessages(user.id, user.secret, user.residency);
			getLastReadMessageId(user.id, user.secret, user.residency);
		}
	}, [store.authStore.isAuth, getCountNoReadMessages, getLastReadMessageId]);

	useEffect(() => {
		if (arrCountNoReadMessages?.length && messageDataSocket) {
			const prevCountNoReadMessages = arrCountNoReadMessages.filter(
				(elem) => elem.location === messageDataSocket.resydency
			);
			if (prevCountNoReadMessages[0] && store.authStore.user.id !== messageDataSocket.id_user) {
				updateArrCountNoReadMessages(messageDataSocket.resydency, prevCountNoReadMessages[0].count + 1);
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
