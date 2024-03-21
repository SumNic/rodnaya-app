import { SecretUser } from "./SecretUser";

export interface ResidencyUser {
    id: number;
    country: string;
    region: string;
    locality: string;
    secret: string;
    error? : {
        message: Date;
    }
}