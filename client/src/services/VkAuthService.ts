import $api from '../api_http/index.ts';
import { AxiosResponse } from 'axios';
import { User } from './UserService.ts';

export default class VkAuthService {
	static async registrationVk(payload: any): Promise<AxiosResponse<User>> {
		return $api.post<User>('/loginByVk', payload);
	}
}
