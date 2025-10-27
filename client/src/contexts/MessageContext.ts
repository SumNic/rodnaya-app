import { createContext, RefObject, useContext } from 'react';
import { MessageWebsocketResponse } from '../models/response/MessageWebsocketResponse';

interface MessageContextType {
	isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	isLoadMessages: boolean;
	setIsLoadMessages: React.Dispatch<React.SetStateAction<boolean>>;
	isLoadingPrevious: boolean;
	setIsLoadingPrevious: React.Dispatch<React.SetStateAction<boolean>>;
	isLoadingNext: boolean;
	setIsLoadingNext: React.Dispatch<React.SetStateAction<boolean>>;
	messageDataSocket: MessageWebsocketResponse | undefined;
	setMessageDataSocket: React.Dispatch<React.SetStateAction<MessageWebsocketResponse | undefined>>;
	isScrollTop: boolean;
	setIsScrollTop: React.Dispatch<React.SetStateAction<boolean>>;
	messagesContainerRef: RefObject<HTMLDivElement>;
}

export const MessageContext = createContext<MessageContextType | null>(null);

export const useMessageContext = () => {
	const messageContext = useContext(MessageContext);

	if (!messageContext) {
		throw new Error('useMessageContext должен быть использован внутри <MessageContext.Provider>');
	}

	return messageContext;
};
