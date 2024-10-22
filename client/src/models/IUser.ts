import { DeclarationUser } from "./DeclarationUser";
import { EndReadMessage } from "./EndReadMessage";
import { LocationUser } from "./LocationUser";

export interface IUser {
    id: number;
    vk_id: number;
    first_name: string;
    last_name: string;
    photo_50: string;
    photo_max: string;
    isDelProfile: boolean;
    isRegistration: boolean;
    dateEditResidency: Date;
    residency: LocationUser;
    secret: string;
    declaration: DeclarationUser;
    endReadMessage: EndReadMessage[];
    blocked: boolean;
    blockedforever: boolean;
    blockeduntil: Date;
}