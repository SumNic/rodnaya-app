import { AxiosResponse } from 'axios';
import $api from '../api_http/index.ts';
import { FoulSendMessage } from '../models/FoulSendMessage.ts';
import { FoulSendMessageResponse } from '../models/response/FoulSendMessageResponse.ts';

export default class AdminService {
	static async reportViolation(dto: FoulSendMessage): Promise<AxiosResponse<string>> {
		return $api.post<string>('/report-violation', dto);
	}

	static async checkAdmin(): Promise<AxiosResponse<boolean>> {
		return $api.get<boolean>('/check-admin');
	}

	static async getFoulMessages(): Promise<AxiosResponse<FoulSendMessageResponse[]>> {
		return $api.get<FoulSendMessageResponse[]>('/get-foul-messages');
	}

	static async fetchCleaningIsComplete(id_foul_message: number, source: string): Promise<AxiosResponse<boolean>> {
		return $api.post<boolean>('/fetch-cleaning-is-complete', { id_foul_message, source });
	}
}
