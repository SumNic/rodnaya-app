import { useEffect } from "react";
import SocketApi from "../api_socket/SocketApi";
import { useStoreContext } from "../contexts/StoreContext";

export const useConnectSocket = () => {

    const { store } = useStoreContext();

    const connectSocket = () => {
        SocketApi.createConnection()
    };

    useEffect(() => {
        if (store.isAuth) {
            connectSocket()
        }
        
    }, [store.isAuth]);
}