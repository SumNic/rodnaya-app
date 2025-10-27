import { MessageForm } from './MessageForm';

export interface PostToChat {
	groupId: number;
	location: string;
	form: MessageForm;
}
