import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        roles: string;
        //   username: string;
    };
}
