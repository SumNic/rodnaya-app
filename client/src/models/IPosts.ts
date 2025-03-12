import { IPost } from "./IPost";

export interface IPosts {
    locality: IPost[];
    region: IPost[];
    country: IPost[];
    world: IPost[];
} 