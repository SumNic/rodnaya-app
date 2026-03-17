import { useEffect, useRef, useState } from 'react';
import { useStore } from './useStore.hook';
import { MessageWebsocketResponse } from '../models/response/MessageWebsocketResponse';
import { Socket } from 'socket.io-client';

export const useGroup = (socket: Socket | null) => {
	const [isLoading, setIsLoading] = useState(false);

	const [isLoadGroups, setIsLoadGroups] = useState(false);
	const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);
	const [isLoadingNext, setIsLoadingNext] = useState(false);
	const [groupDataSocket, setGroupDataSocket] = useState<MessageWebsocketResponse>();
	const [isScrollTop, setIsScrollTop] = useState(false);

	const groupsContainerRef = useRef<HTMLDivElement | null>(null);

	const { store } = useStore();

	const { isAuth } = store.authStore;
	const { userGroupsUnreadInfo, arrCountNoReadPostsGroups, updateArrCountNoReadPostsGroups } = store.groupStore;

	useEffect(() => {
		if (isAuth) {
			userGroupsUnreadInfo();
		}
	}, [store.authStore.isAuth, userGroupsUnreadInfo]);

	useEffect(() => {
		const handleNewMessage = (data: MessageWebsocketResponse) => {
			if (!data) return;
			setGroupDataSocket(data);
		};

		socket?.on('new_post_in_group', handleNewMessage);

		// Очистка при размонтировании
		return () => {
			socket?.off('new_post_in_group', handleNewMessage);
		};
	}, [socket]);

	useEffect(() => {
		if (arrCountNoReadPostsGroups?.length && groupDataSocket) {
			const prevCountNoReadGroups = arrCountNoReadPostsGroups.filter(
				(elem) => elem.groupId === groupDataSocket.group_id
			);
			if (prevCountNoReadGroups[0] && store.authStore.user.id !== groupDataSocket.id_user && groupDataSocket.group_id) {
				updateArrCountNoReadPostsGroups(
					groupDataSocket.group_id,
					+prevCountNoReadGroups[0].count + 1,
					groupDataSocket.location
				);
			}
		}
		setGroupDataSocket(undefined);
	}, [groupDataSocket, arrCountNoReadPostsGroups]);

	return {
		isLoading,
		setIsLoading,
		isLoadGroups,
		setIsLoadGroups,
		isLoadingPrevious,
		setIsLoadingPrevious,
		isLoadingNext,
		setIsLoadingNext,
		groupDataSocket,
		setGroupDataSocket,
		isScrollTop,
		setIsScrollTop,
		groupsContainerRef,
	};
};
