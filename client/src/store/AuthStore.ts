import { makeAutoObservable } from 'mobx';
import { IUser } from '../models/IUser.ts';
import AuthService from '../services/AuthService.ts';
import VkAuthService from '../services/VkAuthService.ts';
import { v4 as uuidv4 } from 'uuid';
import UserService, { UpdateUserDto } from '../services/UserService.ts';
import { IUserVk } from '../models/IUserVk.ts';
import { LOCAL_STORAGE_DEVICE, LOCAL_STORAGE_END_READ_MESSAGE_ID, LOCAL_STORAGE_TOKEN } from '../utils/consts.tsx';
import AdminService from '../services/AdminService.ts';

export default class AuthStore {
	user = {} as IUser;
	userFromVk = {} as IUserVk;
	isAuth = false;
	isAuthVk = false;
	isCondition = false;
	isRegistrationEnd = false;
	isError = false;
	isMessageError = '';
	uuid = uuidv4();
	load = true;
	isEditProfile = false; // используется для закрытия окна редактирования в Personale_page
	declaration = '';
	isDelProfile = false;
	isAdmin = false;

	constructor() {
		this.uuid = uuidv4();
		makeAutoObservable(this);
	}

	setAuth(bool: boolean) {
		this.isAuth = bool;
	}

	setUser = (user: IUser) => {
		this.user = user;
	};

	setUserFromVk(userFromVk: IUserVk) {
		this.userFromVk = userFromVk;
	}

	setAuthVk(bool: boolean) {
		this.isAuthVk = bool;
	}

	setIsCondition(bool: boolean) {
		this.isCondition = bool;
	}

	setRegistrationEnd(bool: boolean) {
		this.isRegistrationEnd = bool;
	}

	setError(bool: boolean) {
		this.isError = bool;
	}
	setMessageError(str: string) {
		this.isMessageError = str;
	}

	setLoad(bool: boolean) {
		this.load = bool;
	}

	setIsEditProfile(bool: boolean) {
		this.isEditProfile = bool;
	}

	setDeclaration(str: string) {
		this.declaration = str;
	}

	setDelProfile(bool: boolean) {
		this.isDelProfile = bool;
	}

	setAdmin(bool: boolean) {
		this.isAdmin = bool;
	}

	logout = async (allDeviceExit: boolean) => {
		try {
			const uuid: string | null = localStorage.getItem(LOCAL_STORAGE_DEVICE);
			await AuthService.logout(this.user.id, uuid, allDeviceExit);
			localStorage.removeItem(LOCAL_STORAGE_TOKEN);
			localStorage.removeItem(LOCAL_STORAGE_DEVICE);
			localStorage.removeItem(LOCAL_STORAGE_END_READ_MESSAGE_ID);
			this.setAuth(false);
			this.setUser({} as IUser);
			if (this.isAdmin) this.setAdmin(false);
		} catch (e: any) {
			console.log(e.response?.data?.message);
		}
	};

	deleteProfile = async (id: number, secret: string) => {
		try {
			await AuthService.deleteProfile(id, secret);
			localStorage.removeItem(LOCAL_STORAGE_TOKEN);
			localStorage.removeItem(LOCAL_STORAGE_DEVICE);
			this.setAuth(false);
			this.setUser({} as IUser);
			if (this.isAdmin) this.setAdmin(false);
		} catch (e: any) {
			console.log(e.response?.data?.message);
		}
	};

	checkAuth = async () => {
		try {
			const device: string | null = localStorage.getItem(LOCAL_STORAGE_DEVICE);
			if (!device) {
				this.setAuth(false);
				return;
			}

			const response = await AuthService.updateRegistration(device);
			if (!response.data) {
				this.setError(true);
				this.setMessageError('Произошла ошибка на сервере. Повторите ошибку позже.');
				this.setAuth(false);
				// localStorage.removeItem(LOCAL_STORAGE_TOKEN);
				// localStorage.removeItem(LOCAL_STORAGE_DEVICE);
				return;
			}
			if (response.data.error) {
				this.setError(true);
				this.setMessageError(response.data.error.message);
				this.setAuth(false);
				// localStorage.removeItem(LOCAL_STORAGE_TOKEN);
				// localStorage.removeItem(LOCAL_STORAGE_DEVICE);
				return;
			}
			localStorage.setItem('token', response.data.token);
			this.setAuth(true);
			this.setUser(response.data.user);
		} catch (e: any) {
			console.error(`Ошибка в checkAuth: ${e}`);
			if (e.response?.data?.message) {
				this.setError(true);
				this.setMessageError(e.response.data.message);
				this.setAuth(false);
				localStorage.removeItem(LOCAL_STORAGE_TOKEN);
				localStorage.removeItem(LOCAL_STORAGE_DEVICE);
				localStorage.removeItem(LOCAL_STORAGE_END_READ_MESSAGE_ID);
			}
		} finally {
			this.setLoad(false);
		}
	};

	checkAdmin = async () => {
		try {
			const isAdmin = await AdminService.checkAdmin();
			if (isAdmin.data) this.setAdmin(true);
		} catch (err) {
			console.log(`Ошибка в checkAdmin: ${err}`);
		}
	};

	registrationVk = async (payload: any) => {
		try {
			const response = await VkAuthService.registrationVk(payload);
			if (!response.data) {
				this.setError(true);
				this.setMessageError('Произошла ошибка на сервере. Повторите ошибку позже.');
				this.setAuth(false);
				return;
			}

			return { data: response.data };
		} catch (e: any) {
			if (e.response?.data?.message) {
				this.setError(true);
				this.setMessageError(e.response.data.message);
				this.setAuth(false);
			}
			console.log(e, 'e');
			// return { error: e.response?.data?.message };
		}
	};

	loginVk = async (id: number, secret: string) => {
		try {
			if (!localStorage.getItem(LOCAL_STORAGE_DEVICE)) {
				localStorage.setItem(LOCAL_STORAGE_DEVICE, this.uuid);
			}

			const device: any = localStorage.getItem(LOCAL_STORAGE_DEVICE);

			const response = await AuthService.setRegistration(id, secret, device);
			if (!response.data) {
				this.setError(true);
				this.setMessageError('Произошла ошибка на сервере. Повторите ошибку позже.');
				this.setAuth(false);
				return;
			}

			localStorage.setItem(LOCAL_STORAGE_TOKEN, response.data.token);
			this.setAuth(true);
			this.setUser(response.data.user);
		} catch (e: any) {
			if (e.response?.data?.message) {
				this.setError(true);
				this.setMessageError(e.response.data.message);
				this.setAuth(false);
			}
		}
	};

	restoreProfile = async (id: number, secret: string) => {
		try {
			const response = await AuthService.restoreProfile(id, secret);
			this.setDelProfile(response.data);
		} catch (e: any) {
			console.log(e.response?.data?.message);
		}
	};

	addDeclaration = async (form: any) => {
		try {
			const response = await UserService.addDeclaration(form);
			this.setUser({ ...this.user, declaration: response.data.declaration });
		} catch (e: any) {
			return { data: e.response?.data?.message };
		}
	};

	getDeclaration = async (id: number) => {
		try {
			const declaration = await UserService.getDeclaration(id);
			this.setDeclaration(declaration.data.declaration);
		} catch (e: any) {
			return { data: e.response?.data?.message };
		}
	};

	updatePersonaleData = async (dto: UpdateUserDto) => {
		try {
			const response = await UserService.updatePersonaleData(dto);
			this.setUser({ ...this.user, ...response.data });
			return response.data;
		} catch (e: any) {
			return { data: e.response?.data?.message };
		}
	};
}
