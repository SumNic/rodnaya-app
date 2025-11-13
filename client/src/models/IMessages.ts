import { Message } from '../services/MessagesService';
import { User } from '../services/PublicationsService';

export type MessageWithPartialUser = Omit<Message, 'user'> & {
	user: Partial<User>;
} & { createdAt?: string };

export interface IMessages {
	locality: MessageWithPartialUser[];
	region: MessageWithPartialUser[];
	country: MessageWithPartialUser[];
	world: MessageWithPartialUser[];
}
