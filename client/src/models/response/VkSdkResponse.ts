import { IUserVk } from "../IUserVk";

export interface VkSdkResponse {
    token: string;
    user: IUserVk;
    error?: 
    {
        error_msg: string
    }
}