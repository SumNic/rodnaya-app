import { useEffect, useState } from "react";
import { useStore } from "./useStore.hook.ts";
import RefAutoComplete from "antd/es/auto-complete/index";
import MessagesService from "../services/MessagesService.ts";



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