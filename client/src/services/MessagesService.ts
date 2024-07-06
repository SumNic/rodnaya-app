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

    static async setCountMessages(
        id_user: number,
        secret: string,
        location: string
    ) {
        return $api.post("/set-count-messages", {
            id_user, secret, location,
        });
    }
}
