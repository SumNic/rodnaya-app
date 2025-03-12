import { AxiosResponse } from 'axios';
import $api from '../api_http/index.ts';
import { IPost } from '../models/IPost.ts';
import { SendedMessage } from '../models/SendedMessage.ts';
import { LocationUser } from '../models/LocationUser.ts';
import { toJS } from 'mobx';

export default class PublicationsService {
	static async sendPublication(dto: SendedMessage): Promise<AxiosResponse<number>> {
		return $api.post<number>('/send-publication', dto);
	}

	static async getAllPublications(territory: LocationUser, pageNumber: number): Promise<AxiosResponse<IPost[]>> {
		const territorySerial = toJS(territory);
		return $api.get<IPost[]>('/get-all-publications', {
			params: { ...territorySerial, pageNumber },
		});
	}

	static async getPublicationFromId(id: number): Promise<AxiosResponse<IPost>> {
		return $api.get<IPost>(`/get-publication/${id}`);
	}

	static async blockedPublications(id_message: number, selectedActionIndex: number): Promise<AxiosResponse<string>> {
		return $api.post('/blocked-publication', {
			id_message,
			selectedActionIndex,
		});
	}

	static async getUserPublications(id: number, pageNumber: number): Promise<AxiosResponse<IPost[]>> {
		return $api.get<IPost[]>('/get-user-publications', {
			params: { id, pageNumber },
		});
	}
}
