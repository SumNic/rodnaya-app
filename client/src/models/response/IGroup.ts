import { IUser } from "../IUser";

export interface IGroup {
    id: number;
    name: string;
    task: string;
    avatar: string;
    world: string;
    country: string;
    region: string;
    locality: string;
    blocked: boolean;
    userId: number;
    users: IUser[];
}