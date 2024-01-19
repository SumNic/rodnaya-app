import $api from "../http";
import { AxiosResponse } from "axios";
import { VkSdkResponse } from "../models/response/VkSdkResponse";

export default class VkAuthService {

    static async registrationVk(payload: any): Promise<AxiosResponse<VkSdkResponse>> {
        return $api.post<VkSdkResponse>('/loginByVk', payload)
    }
}