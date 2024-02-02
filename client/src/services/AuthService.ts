import { AxiosResponse } from "axios";
import $api from "../http";
import { AuthResponse } from "../models/response/AuthResponse";
import { ResidencyUser } from "../models/ResidencyUser";

export default class AuthService {
    // static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    //     return $api.post<AuthResponse>('/login', {email, password})
    // }

    // static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    //     return $api.post<AuthResponse>('/registration', {email, password})
    // }

    static async logout(): Promise<void> {
        return $api.post('/logout')
    }

    static async createResidencyUsers(dto: ResidencyUser): Promise<AxiosResponse<ResidencyUser>> {
        return $api.post<ResidencyUser>('/create-residency', dto)
    }

    static async setRegistration(id: number): Promise<AxiosResponse<ResidencyUser>> {
        return $api.post<ResidencyUser>('/set-registration', id)
    }
}