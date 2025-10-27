import { MessageForm } from './MessageForm';

export interface SendedMessage {
	location?: string;
	form: MessageForm;
}
