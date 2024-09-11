import { useState } from "react";

export const useMessage = () => {
    const [count, setCount] = useState<number>(0);

    return {
        count,
        setCount
        // location,
	    // setLocation,
        // endIdFromPage,
        // setEndIdFromPage
    };
};