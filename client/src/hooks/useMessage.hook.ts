import { useState } from "react";

export const useMessage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [sendMessageId, setSendMessageId] = useState<number>()

    return {
        isLoading,
        setIsLoading,
        sendMessageId, 
        setSendMessageId
    };
};