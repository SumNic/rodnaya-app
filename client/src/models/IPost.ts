import { IFiles } from "./IFiles.ts";
import { IUser } from "./IUser.ts";

export interface IPost {
    id: number;
    message: string;
    location: string;
    blocked: string;
    userId: number;
    files?: IFiles[];
    user: IUser;
    createdAt: Date
}