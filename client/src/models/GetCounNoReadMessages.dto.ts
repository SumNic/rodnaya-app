import { LocationUser } from './LocationUser';

export interface GetCountNoReadMessagesDto {
	id: number;
	secret: string;
	residency: LocationUser;
}
