import $api from '../api_http/index.ts';
import { AxiosResponse } from 'axios';
import { IUser } from '../models/IUser';

export default class VkAuthService {
	static async registrationVk(payload: any): Promise<AxiosResponse<IUser>> {
		return $api.post<IUser>('/loginByVk', payload);
	}
}
