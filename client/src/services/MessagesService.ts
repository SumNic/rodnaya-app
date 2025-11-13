import { AxiosResponse } from 'axios';
import $api from '../api_http/index.ts';
import { IPost } from '../models/IPost.ts';
import { GetCountNoReadMessagesDto } from '../models/GetCounNoReadMessages.dto.ts';
import { CountNoReadMessages } from '../models/CountNoReadMessages.ts';
import { EndReadMessagesId } from '../models/EndReadMessagesId.ts';
import { components } from '../utils/api.ts';

export type EndMessageDto = components['schemas']['EndMessageDto'];
export type CreateMessageDto = components['schemas']['CreateMessageDto'];
export type UpdateMessageDto = components['schemas']['UpdateMessageDto'];
export type DeleteMessageDto = components['schemas']['DeleteMessageDto'];
export type CreateLocationDto = components['schemas']['CreateLocationDto'];
export type Message = components['schemas']['Messages'];

export default class MessagesService {
	static async sendMessage(dto: CreateMessageDto): Promise<AxiosResponse<number>> {
		return $api.post<number>('/send-message', dto);
	}

	static async editMessage(dto: UpdateMessageDto): Promise<AxiosResponse<string>> {
		return $api.patch<string>('/edit-message', dto);
	}

	static async deleteMessage(dto: DeleteMessageDto): Promise<AxiosResponse<string>> {
		return $api.delete<string>('/delete-message', { data: dto });
	}

	static async getAllMessages(
		id: number,
		pageNumber: number,
		secret: string,
		location: string | undefined
	): Promise<AxiosResponse<Message[]>> {
		return $api.get<Message[]>('/get-all-messages', {
			params: { id, pageNumber, secret, location },
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

	static async getCountNoReadMessages(dto: EndMessageDto): Promise<AxiosResponse<CountNoReadMessages[]>> {
		return $api.get<CountNoReadMessages[]>('/get-count-no-read-messages', {
			params: dto,
		});
	}

	static async getLastReadMessageId(dto: GetCountNoReadMessagesDto): Promise<AxiosResponse<EndReadMessagesId[]>> {
		return $api.get<EndReadMessagesId[]>('/get-end-read-messages-id', {
			params: dto,
		});
	}

	static async setEndReadMessagesId(id_message: number, location: string) {
		return $api.post('/set-end-read-messages-id', {
			id_message,
			location,
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
