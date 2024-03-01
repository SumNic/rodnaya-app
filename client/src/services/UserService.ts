import { AxiosResponse } from "axios";
import $api from "../http";
import { IUser } from "../models/IUser";
import { DeclarationUser } from "../models/DeclarationUser";
import { PersonaleUser } from "../models/PersonaleUser";

export default class UserService {
    static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/users')
    }

    static async addDeclaration(form: DeclarationUser): Promise<AxiosResponse<IUser>> {
        return $api.post<IUser>('/add-declaration', form)
    }

    static async getDeclaration(id: number): Promise<AxiosResponse<DeclarationUser>> {
        return $api.get<DeclarationUser>(`/get-declaration/${id}`)
    }
    
    static async udatePersonaleData(secret: string, form: PersonaleUser): Promise<AxiosResponse<IUser>> {
        return $api.post<IUser>(`/updata-personale/${secret}`, form)
    }
    
}