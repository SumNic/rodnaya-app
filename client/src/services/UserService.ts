import { AxiosResponse } from 'axios';
import $api from '../api_http/index.ts';
import { DeclarationUser } from '../models/DeclarationUser';
import { components } from '../utils/api.ts';

export type User = components['schemas']['User'];
export type UpdateUserDto = components['schemas']['UpdateUserDto'];
export default class UserService {
	static async fetchUsers(): Promise<AxiosResponse<User[]>> {
		return $api.get<User[]>('/users');
	}

	static async getUser(id: number): Promise<AxiosResponse<User>> {
		return $api.get<User>(`/get-user/${id}`);
	}

	static async addDeclaration(form: DeclarationUser): Promise<AxiosResponse<User>> {
		return $api.post<User>('/add-declaration', form);
	}

	static async getDeclaration(id: number): Promise<AxiosResponse<DeclarationUser>> {
		return $api.get<DeclarationUser>(`/get-declaration/${id}`);
	}

	static async updatePersonaleData(dto: UpdateUserDto): Promise<AxiosResponse<User>> {
		return $api.post<User>('/updata-personale', dto);
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
