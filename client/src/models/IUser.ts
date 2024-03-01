import { DeclarationUser } from "./DeclarationUser";
import { LocationUser } from "./LocationUser";
import { SecretUser } from "./SecretUser";

export interface IUser {
    id: number;
    vk_id: number;
    first_name: string;
    last_name: string;
    photo_50: string;
    photo_max: string;
    isRegistration: boolean;
    residency: LocationUser;
    secret: SecretUser;
    declaration: DeclarationUser;
}