import { useEffect, useMemo, useState } from "react";
import { CountNoReadMessages } from "../models/CountNoReadMessages";
import MessagesService from "../services/MessagesService";
import { useStore } from "./useStore.hook";
import { LocationUser } from "../models/LocationUser";
import { EndReadMessagesId } from "../models/endReadMessagesId";
import { IPosts } from "../models/IPosts";
import { MessageWebsocketResponse } from "../models/response/MessageWebsocketResponse";

export const useMessage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [sendMessageId, setSendMessageId] = useState<number>()
    const [arrCountMessages, setArrCountMessages] = useState<CountNoReadMessages[]>([]);
	const [ arrEndMessagesId, setArrEndMessagesId ] = useState<EndReadMessagesId[]>([]);
	const [posts, setPosts] = useState<IPosts[]>()
	const [ isLoadMessages, setIsLoadMessages ] = useState(false);
	const [isLoadingPrevious, setIsLoadingPrevious ] = useState(false);
	const [ isLoadingNext, setIsLoadingNext ] = useState(false);
	const [messageDataSocket, setMessageDataSocket] = useState<MessageWebsocketResponse>();

    const { store } = useStore()

	useMemo(() => posts, [])

	useEffect(() => {
		if (store.isAuth) {
			getCountMessages();
			getEndReadMessagesId();
			
		}
	}, [store.isAuth]);

    const updateArrCountMessages = (location: string, count: number) => {
        setArrCountMessages(prev => {
            const existingEntry = prev.find(item => item.location === location);
            if (existingEntry !== undefined) {
                return prev.map(elem => 
                    elem.location === location ? { ...elem, count } : elem
                );
            }
            // Если записи нет, добавляем новую
            return [...prev, { location, count }];
        });
    };

	const updateArrEndMessagesId = (location: string, id: number) => {
		setArrEndMessagesId(prev => {
            const existingEntry = prev.find(item => item.location === location);
            if (existingEntry) {
                return prev.map(elem => 
                    elem.location === location ? { ...elem, id } : elem
                );
            }
            // Если записи нет, добавляем новую
            return [...prev, { location, id }];
        });
	}

	// Функция для фильтрации свойств
	function filterLocationUser(input: any): LocationUser {
		const { country, region, locality } = input;
		return { country, region, locality };
	}

    const getCountMessages = async () => {
		try {
			const residencyUser: LocationUser = {world: 'Земля', ...filterLocationUser(store.user.residency)};
			
			const dto = {
				id: store.user.id,
				secret: store.user.secret,
				residency:  residencyUser
			}

			const result = await MessagesService.getCountNoReadMessages(dto);
			if (result.data) {
				result.data.map(elem => {
					updateArrCountMessages(elem.location, elem.count);
				})
			}
		} catch (e: any) {
			console.log(`Ошибка в getCountMessages: ${e}`);
			// return { data: e.response?.data?.message };
		}
	}

    const getEndReadMessagesId = async() => {
		try {
			const residencyUser: LocationUser = {world: 'Земля', ...filterLocationUser(store.user.residency)};
			
			const dto = {
				id: store.user.id,
				secret: store.user.secret,
				residency:  residencyUser
			}

			const result = await MessagesService.getEndReadMessagesId(dto);
			if (result.data) {
				result.data.map(elem => {
					updateArrEndMessagesId(elem.location, elem.id);
				})
			}
		} catch (e: any) {
			console.log(`Ошибка в getEndReadMessagesId: ${e}`);
			// return { data: e.response?.data?.message };
		}
	}

	useEffect(() => {
		if (arrCountMessages?.length && messageDataSocket) {
			const prevCountNoReadMessages = arrCountMessages.filter((elem) => elem.location === messageDataSocket.resydency);
			if (prevCountNoReadMessages[0] && store.user.id !== messageDataSocket.id_user) {
				updateArrCountMessages(messageDataSocket.resydency, prevCountNoReadMessages[0].count + 1);
				// updateArrEndMessagesId(data.resydency, data.id_message)
			}
			// setMessageDataSocket(undefined);
		}
	}, [messageDataSocket]);

    return {
        isLoading,
        setIsLoading,
        sendMessageId, 
        setSendMessageId,
        arrCountMessages,
        updateArrCountMessages,
        getCountMessages,
        getEndReadMessagesId,
		arrEndMessagesId,
		updateArrEndMessagesId,
		posts,
        setPosts,
		isLoadMessages,
		setIsLoadMessages,
		isLoadingPrevious,
		setIsLoadingPrevious,
		isLoadingNext,
		setIsLoadingNext,
		messageDataSocket,
		setMessageDataSocket
    };
};