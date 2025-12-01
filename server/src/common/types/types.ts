import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        roles: string;
        //   username: string;
    };
}

export enum DevicePlatform {
    ANDROID = 'android',
    IOS = 'ios',
    WEB = 'web',
    UNKNOWN = 'unknown',
}
