import { AxiosResponse } from "axios";
import $api from "../http";
import { IUser } from "../models/IUser";
import { DeclarationUser } from "../models/DeclarationUser";
import { PersonaleUser } from "../models/PersonaleUser";

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
        id_user: number,
        secret: string,
        location: string | undefined
    ): Promise<AxiosResponse<any>> {
        return $api.get<any>("/get-all-messages", {
            params: { id_user, secret, location },
        });
    }

    static async getCountMessages(
        id_user: number,
        secret: string,
        location: string | undefined
    ): Promise<AxiosResponse<number>> {
        return $api.get<any>("/get-count-messages", {
            params: { id_user, secret, location },
        });
    }
}
