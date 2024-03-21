import { AxiosResponse } from "axios";
import $api from "../http";
import { AuthResponse } from "../models/response/AuthResponse";
import { ResidencyUser } from "../models/ResidencyUser";
import { VkSdkResponse } from "../models/response/VkSdkResponse";

export default class AuthService {
    // static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    //     return $api.post<AuthResponse>('/login', {email, password})
    // }

    // static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
    //     return $api.post<AuthResponse>('/registration', {email, password})
    // }

    static async logout(id: number, uuid: string | null, allDeviceExit: boolean): Promise<void> {
        return $api.post('/logout', {id: id, uuid: uuid, allDeviceExit: allDeviceExit})
    }

    static async deleteProfile(id: number, secret: string): Promise<void> {
        return $api.post('/delete-profile', {id, secret})
    }

    static async restoreProfile(id: number, secret: string): Promise<AxiosResponse<boolean>> {
        return $api.post('/restore-profile', {id, secret})
    }

    static async createResidencyUsers(dto: ResidencyUser): Promise<AxiosResponse<ResidencyUser>> {
        return $api.post<ResidencyUser>('/create-residency', dto)
    }

    static async setRegistration(id: number, secret: string, uuid: any): Promise<AxiosResponse<VkSdkResponse>> {
        return $api.post<VkSdkResponse>('/set-registration', {id, secret, uuid})
    }

    static async updateRegistration(device: string | null): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/refresh-tokens', {uuid: device})
    }
}