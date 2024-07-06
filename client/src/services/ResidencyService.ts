import { AxiosResponse } from "axios";
import $api from "../http";
import { AuthResponse } from "../models/response/AuthResponse";
import { ResidencyResponse } from "../models/response/ResidencyResponse";

export default class ResidencyService {

    static async getResidencyUsers(): Promise<AxiosResponse<ResidencyResponse[]>> {
        return $api.get<ResidencyResponse[]>('/all-residencys')
    }

    static async updateRegistration(device: string | null): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/refresh-tokens', {uuid: device})
    }
}