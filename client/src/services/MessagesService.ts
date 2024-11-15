import { AxiosResponse } from 'axios';
import $api from '../api_http/index.ts';
import { IPost } from '../models/IPost.ts';
import { GetCountNoReadMessagesDto } from '../models/GetCounNoReadMessages.dto.ts';
import { CountNoReadMessages } from '../models/CountNoReadMessages.ts';
import { EndReadMessagesId } from '../models/endReadMessagesId.ts';
import { SendedMessage } from '../models/SendedMessage.ts';

export default class MessagesService {
	static async sendMessage(dto: SendedMessage): Promise<AxiosResponse<number>> {
		return $api.post<number>('/send-message', dto);
	}

	static async getAllMessages(
		id: number,
		start_message_id: number,
		secret: string,
		location: string | undefined
	): Promise<AxiosResponse<IPost>> {
		return $api.get<any>('/get-all-messages', {
			params: { id, start_message_id, secret, location },
		});
	}

	static async getPreviousMessages(
		id: number,
		start_message_id: number,
		secret: string,
		location: string | undefined
	): Promise<AxiosResponse<IPost>> {
		return $api.get<any>('/get-previous-messages', {
			params: { id, start_message_id, secret, location },
		});
	}

	static async getNextMessages(
		id: number,
		start_message_id: number,
		secret: string,
		location: string | undefined
	): Promise<AxiosResponse<IPost>> {
		return $api.get<any>('/get-next-messages', {
			params: { id, start_message_id, secret, location },
		});
	}

	static async getCountNoReadMessages(dto: GetCountNoReadMessagesDto): Promise<AxiosResponse<CountNoReadMessages[]>> {
		return $api.get<CountNoReadMessages[]>('/get-count-no-read-messages', {
			params: dto,
		});
	}

	static async getEndReadMessagesId(dto: GetCountNoReadMessagesDto): Promise<AxiosResponse<EndReadMessagesId[]>> {
		return $api.get<EndReadMessagesId[]>('/get-end-read-messages-id', {
			params: dto,
		});
	}

	static async setEndReadMessagesId(id_user: number, id_message: number, location: string, secret: string) {
		return $api.post('/set-end-read-messages-id', {
			id_user,
			id_message,
			location,
			secret,
		});
	}

	static async getMessageFromId(id_message: number): Promise<AxiosResponse<IPost>> {
		return $api.get<IPost>('/get-message-from-id', {
			params: { id_message },
		});
	}

	static async blockedMessages(id_message: number, selectedActionIndex: number): Promise<AxiosResponse<string>> {
		return $api.post('/blocked-message', {
			id_message,
			selectedActionIndex,
		});
	}
}
