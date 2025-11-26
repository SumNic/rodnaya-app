import $api from '../api_http/index.ts';
import { AxiosResponse } from 'axios';
import { User } from './UserService.ts';
import { components } from '../utils/api.ts';

export type PkceCode = components['schemas']['PkceCode'];
export type VkLoginAndroidDto = components['schemas']['VkLoginAndroidDto'];

export default class VkAuthService {
	static async registrationVk(payload: any): Promise<AxiosResponse<User>> {
		return $api.post<User>('/loginByVk', payload);
	}

	static async registrVkAndroid(payload: VkLoginAndroidDto): Promise<AxiosResponse<User>> {
		return $api.post<User>('/loginByVkAndroid', payload);
	}

	static async getPkcecode(): Promise<AxiosResponse<PkceCode>> {
		return $api.get<PkceCode>('/pkce');
	}
}
