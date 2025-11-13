import { AxiosResponse } from 'axios';
import $api from '../api_http/index.ts';
import { IUser } from '../models/IUser';
import { DeclarationUser } from '../models/DeclarationUser';
import { components } from '../utils/api.ts';

export type User = components['schemas']['User'];
export type UpdateUserDto = components['schemas']['UpdateUserDto'];
export default class UserService {
	static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
		return $api.get<IUser[]>('/users');
	}

	static async getUser(id: number): Promise<AxiosResponse<IUser>> {
		return $api.get<IUser>(`/get-user/${id}`);
	}

	static async addDeclaration(form: DeclarationUser): Promise<AxiosResponse<IUser>> {
		return $api.post<IUser>('/add-declaration', form);
	}

	static async getDeclaration(id: number): Promise<AxiosResponse<DeclarationUser>> {
		return $api.get<DeclarationUser>(`/get-declaration/${id}`);
	}

	static async updatePersonaleData(dto: UpdateUserDto): Promise<AxiosResponse<IUser>> {
		return $api.post<IUser>('/updata-personale', dto);
	}

	static async blockedUser(userId: number, selectedPunishmentIndex: number): Promise<AxiosResponse<string>> {
		return $api.post('/blocked-user', { userId, selectedPunishmentIndex });
	}

	static async checkBlocked(userId: number): Promise<AxiosResponse<Date>> {
		return $api.get<Date>('/check-blocked', {
			params: { userId },
		});
	}
}
