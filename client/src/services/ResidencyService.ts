import { AxiosResponse } from "axios";
import $api from "../http";
import { AuthResponse } from "../models/response/AuthResponse";
import { ResidencyUser } from "../models/ResidencyUser";
import { VkSdkResponse } from "../models/response/VkSdkResponse";
import { ResidencyResponse } from "../models/response/ResidencyResponse";

export default class ResidencyService {

    static async getResidencyUsers(): Promise<AxiosResponse<ResidencyResponse[]>> {
        return $api.get<ResidencyResponse[]>('/all-residencys')
    }

    static async setRegistration(id: number, secret: string, uuid: any): Promise<AxiosResponse<VkSdkResponse>> {
        return $api.post<VkSdkResponse>('/set-registration', {id, secret, uuid})
    }

    static async updateRegistration(device: string | null): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/refresh-tokens', {uuid: device})
    }
}