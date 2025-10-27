import { IUser } from '../IUser';

export interface ResidencyResponse {
	country: string;
	region: string;
	locality: string;
	users: IUser[];
}
