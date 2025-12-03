import { AxiosResponse } from 'axios';
import $api from '../api_http/index.ts';
import { components } from '../utils/api.ts';

export type MobileAppInfoDto = components['schemas']['MobileAppInfoDto'];
export default class CommonService {
	static async addVersion({ versionApp }: { versionApp: string }): Promise<AxiosResponse<MobileAppInfoDto>> {
		return $api.post<MobileAppInfoDto>('/add-version-app', { versionApp });
	}

	static async getInfo(): Promise<AxiosResponse<MobileAppInfoDto>> {
		return $api.get<MobileAppInfoDto>('/get-common-info');
	}
}
