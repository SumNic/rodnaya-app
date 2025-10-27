import { EndReadMessage } from './EndReadMessage';

export interface ResidencyUser {
	id: number;
	country: string;
	region: string;
	locality: string;
	secret: string;
	endReadMessage?: EndReadMessage;
	error?: {
		message: Date;
	};
}
