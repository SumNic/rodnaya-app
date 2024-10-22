import { IUser } from "../IUser";

export interface VkSdkResponse {
    user: IUser;
    token: string;
    refreshToken: string;
}