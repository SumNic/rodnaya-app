import { AxiosResponse } from 'axios';
import $api from '../api_http/index.ts';
import { IPost } from '../models/IPost.ts';
import { LocationUser } from '../models/LocationUser.ts';
import { toJS } from 'mobx';

import type { components } from '../utils/api.ts'; // путь к сгенерированным типам

export type Publication = components['schemas']['Publications'];
export type User = components['schemas']['User'];
export type CreatePublicationDto = components['schemas']['CreatePublicationDto'];

export default class PublicationsService {
	static async sendPublication(dto: CreatePublicationDto): Promise<AxiosResponse<number>> {
		return $api.post<number>('/send-publication', dto);
	}

	static async getAllPublications(territory: LocationUser, pageNumber: number): Promise<AxiosResponse<Publication[]>> {
		const territorySerial = toJS(territory);
		const res = $api.get<Publication[]>('/get-all-publications', {
			params: { ...territorySerial, pageNumber },
		});
		return res;
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
