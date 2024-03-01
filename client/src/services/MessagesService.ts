import { AxiosResponse } from "axios";
import $api from "../http";
import { IUser } from "../models/IUser";
import { DeclarationUser } from "../models/DeclarationUser";
import { PersonaleUser } from "../models/PersonaleUser";

export default class MessagesService {
    // static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    //     return $api.get<IUser[]>('/users')
    // }

    static async sendMessage(user: IUser, location: string | undefined, form: any): Promise<AxiosResponse<IUser>> {
        return $api.post<IUser>('/send-message', {user, location, form})
    }

    // static async getDeclaration(id: number): Promise<AxiosResponse<DeclarationUser>> {
    //     return $api.get<DeclarationUser>(`/get-declaration/${id}`)
    // }
    
    // static async udatePersonaleData(secret: string, form: PersonaleUser): Promise<AxiosResponse<IUser>> {
    //     return $api.post<IUser>(`/updata-personale/${secret}`, form)
    // }
    
}