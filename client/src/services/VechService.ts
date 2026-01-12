import { AxiosResponse } from 'axios';
import { components } from '../utils/api';
import $api from '../api_http/index.ts';

export class VechService {
	static async createVech(
		data: components['schemas']['CreateMeetingDto']
	): Promise<AxiosResponse<components['schemas']['Zoom']>> {
		return $api.post<components['schemas']['Zoom']>('/create-meeting', data);
	}

	static async getVeches(): Promise<
		AxiosResponse<
			components['schemas']['ZoomWithUnreadDto'][] & {
				isUnread?: boolean;
			}
		>
	> {
		return $api.get<components['schemas']['ZoomWithUnreadDto'][]>('/get-meeting');
	}

	static async markViewed(id: number): Promise<AxiosResponse<any>> {
		return $api.post<any>(`/meeting/${id}/view`);
	}
}
