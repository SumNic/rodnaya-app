import { createContext, useContext } from 'react';
import { CountNoReadMessages } from '../models/CountNoReadMessages';
import { EndReadMessagesId } from '../models/endReadMessagesId';
import { IPosts } from '../models/IPosts';
import { MessageWebsocketResponse } from '../models/response/MessageWebsocketResponse';

interface MessageContextType {
    isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    sendMessageId: number | undefined;
	setSendMessageId: React.Dispatch<React.SetStateAction<number | undefined>>;
    arrCountMessages: CountNoReadMessages[] | undefined;
    updateArrCountMessages: (location: string, count: number) => void;
    getCountMessages: () => Promise<void>;
    getEndReadMessagesId: () => Promise<void>;
    arrEndMessagesId: EndReadMessagesId[] | undefined;
    updateArrEndMessagesId: (location: string, id: number) => void;
    posts: IPosts[] | undefined;
	setPosts: React.Dispatch<React.SetStateAction<IPosts[] | undefined>>;
    isLoadMessages: boolean;
	setIsLoadMessages: React.Dispatch<React.SetStateAction<boolean>>;
    isLoadingPrevious: boolean;
	setIsLoadingPrevious: React.Dispatch<React.SetStateAction<boolean>>;
    isLoadingNext: boolean;
	setIsLoadingNext: React.Dispatch<React.SetStateAction<boolean>>;
    messageDataSocket:MessageWebsocketResponse | undefined;
	setMessageDataSocket: React.Dispatch<React.SetStateAction<MessageWebsocketResponse | undefined>>;
};

export const MessageContext = createContext<MessageContextType | null>(null);

export const useMessageContext = () => {
    const messageContext = useContext(MessageContext);

    if (!messageContext) {
        throw new Error('useMessageContext должен быть использован внутри <MessageContext.Provider>');
    };

    return messageContext;
};