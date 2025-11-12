import { AxiosResponse } from 'axios';
import $api from '../api_http/index.ts';
import { AuthResponse } from '../models/response/AuthResponse';
import { VkSdkResponse } from '../models/response/VkSdkResponse';
import { components } from '../utils/api.ts';

export type UuidDevice = components['schemas']['UuidDevice'];

export default class AuthService {
	static async logout(id: number, uuid: string | null, allDeviceExit: boolean): Promise<void> {
		return $api.post('/logout', { id: id, uuid: uuid, allDeviceExit: allDeviceExit });
	}

	static async deleteProfile(id: number, secret: string): Promise<void> {
		return $api.post('/delete-profile', { id, secret });
	}

	static async restoreProfile(id: number, secret: string): Promise<AxiosResponse<boolean>> {
		return $api.post('/restore-profile', { id, secret });
	}

	static async setRegistration(id: number, secret: string, uuid: any): Promise<AxiosResponse<VkSdkResponse>> {
		return $api.post<VkSdkResponse>('/set-registration', { id, secret, uuid });
	}

	static async updateRegistration(device: string): Promise<AxiosResponse<AuthResponse>> {
		const dto: UuidDevice = { uuid: device };
		return $api.post<AuthResponse>('/refresh-tokens', dto);
	}
}
