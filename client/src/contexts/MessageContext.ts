import { createContext, useContext } from 'react';

interface MessageContextType {
    count: number;
	setCount: React.Dispatch<React.SetStateAction<number>>;
    // location: string | undefined;
	// setLocation: React.Dispatch<React.SetStateAction<string | undefined>>;
    // endIdFromPage: string | undefined;
	// setEndIdFromPage: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const MessageContext = createContext<MessageContextType | null>(null);

export const useMessageContext = () => {
    const messageContext = useContext(MessageContext);

    if (!messageContext) {
        throw new Error('useMessageContext должен быть использован внутри <MessageContext.Provider>');
    };

    return messageContext;
};