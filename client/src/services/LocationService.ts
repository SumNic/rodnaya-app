import { AxiosResponse } from 'axios';
import $api from '../api_http/index.ts';
import { LocationUser } from '../models/LocationUser';
import { ResidencyResponse } from '../models/response/ResidencyResponse.ts';
import { ResidencyUser } from '../models/ResidencyUser.ts';

export default class LocationService {
	static async fetchCountryUsers(): Promise<AxiosResponse<LocationUser[]>> {
		return $api.get<LocationUser[]>('/country');
	}

	static async fetchRegionUsers(country: string): Promise<AxiosResponse<LocationUser[]>> {
		return $api.get<LocationUser[]>('/region/' + country);
	}

	static async fetchLocalityUsers(region: string): Promise<AxiosResponse<LocationUser[]>> {
		return $api.get<LocationUser[]>('/locality/' + region);
	}

	static async getResidencyUsers(): Promise<AxiosResponse<ResidencyResponse[]>> {
		return $api.get<ResidencyResponse[]>('/all-residencys');
	}

	static async createResidencyUsers(dto: ResidencyUser): Promise<AxiosResponse<ResidencyUser>> {
		return $api.post<ResidencyUser>('/create-residency', dto);
	}
}
