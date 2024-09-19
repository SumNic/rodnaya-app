import { createContext, useContext } from 'react';

interface MessageContextType {
    isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    sendMessageId: number | undefined;
	setSendMessageId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export const MessageContext = createContext<MessageContextType | null>(null);

export const useMessageContext = () => {
    const messageContext = useContext(MessageContext);

    if (!messageContext) {
        throw new Error('useMessageContext должен быть использован внутри <MessageContext.Provider>');
    };

    return messageContext;
};