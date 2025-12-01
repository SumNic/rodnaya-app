import { AxiosResponse } from 'axios';
import $api from '../api_http/index.ts';

export default class CommonService {
	static async getInfo(): Promise<AxiosResponse<any>> {
		return $api.get<any[]>('/get-common-info');
	}
}
