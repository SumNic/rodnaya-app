import { AxiosResponse } from 'axios';
import $api from '../api_http/index.ts';
import { components } from '../utils/api.ts';

export type UuidDevice = components['schemas']['UuidDevice'];
export type OutputUserAndTokens = components['schemas']['OutputUserAndTokens'];

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

	static async setRegistration(id: number, secret: string, uuid: any): Promise<AxiosResponse<OutputUserAndTokens>> {
		return $api.post<OutputUserAndTokens>('/set-registration', { id, secret, uuid });
	}

	static async updateRegistration(device: string): Promise<AxiosResponse<OutputUserAndTokens>> {
		const dto: UuidDevice = { uuid: device };
		return $api.post<OutputUserAndTokens>('/refresh-tokens', dto);
	}
}
