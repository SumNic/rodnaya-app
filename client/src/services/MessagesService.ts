import { AxiosResponse } from "axios";
import $api from "../http";

export default class MessagesService {
    static async sendMessage(
        id_user: number,
        secret: string,
        location: string | undefined,
        form: any
    ): Promise<AxiosResponse<number>> {
        return $api.post<number>("/send-message", {
            id_user,
            secret,
            location,
            form,
        });
    }

    static async getAllMessages(
        id: number,
        secret: string,
        location: string | undefined
    ): Promise<AxiosResponse<any>> {
        return $api.get<any>("/get-all-messages", {
            params: { id, secret, location },
        });
    }

    static async getCountNoReadMessages(
        id: number,
        secret: string,
        location: string | undefined
    ): Promise<AxiosResponse<number>> {
        return $api.get<any>("/get-count-no-read-messages", {
            params: { id, secret, location },
        });
    }

    static async getEndReadMessagesId(
        id: number,
        secret: string,
        location: string | undefined
    ): Promise<AxiosResponse<number>> {
        return $api.get<any>("/get-end-read-messages-id", {
            params: { id, secret, location },
        });
    }

    static async setEndReadMessagesId(
        id_user: number,
        id_message: number,
        location: string,
        secret: string,        
    ) {
        console.log(id_user, id_message, location, secret, 'id_user, id_message, location, secret');
        return $api.post("/set-end-read-messages-id", {
            id_user, id_message, location, secret, 
        });
    }
}
