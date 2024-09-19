import { AxiosResponse } from 'axios';
import $api from '../http/index.ts';
import { IPost } from '../models/IPost.ts';
import { FoulSendMessage } from '../models/FoulSendMessage.ts';

export default class AdminService {
	static async reportViolation(dto: FoulSendMessage): Promise<AxiosResponse<string>> {
		return $api.post<string>('/report-violation', dto);
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

	static async getCountNoReadMessages(
		id: number,
		secret: string,
		location: string | undefined
	): Promise<AxiosResponse<number>> {
		return $api.get<any>('/get-count-no-read-messages', {
			params: { id, secret, location },
		});
	}

	static async getEndReadMessagesId(
		id: number,
		secret: string,
		location: string | undefined
	): Promise<AxiosResponse<number>> {
		return $api.get<any>('/get-end-read-messages-id', {
			params: { id, secret, location },
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
}
