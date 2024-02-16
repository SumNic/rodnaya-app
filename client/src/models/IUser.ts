import { LocationUser } from "./LocationUser";

export interface IUser {
    id: number;
    vk_id: number;
    first_name: string;
    last_name: string;
    photo_50: string;
    photo_max: string;
    isRegistration: boolean;
    residency: LocationUser;
}