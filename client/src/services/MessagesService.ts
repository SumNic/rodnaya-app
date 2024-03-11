import { AxiosResponse } from "axios";
import $api from "../http";
import { IUser } from "../models/IUser";
import { DeclarationUser } from "../models/DeclarationUser";
import { PersonaleUser } from "../models/PersonaleUser";

export default class MessagesService {

    static async sendMessage(id_user: number, secret: string, location: string | undefined, form: any): Promise<AxiosResponse<IUser>> {
        return $api.post<IUser>('/send-message', {id_user, secret, location, form})
    }
}