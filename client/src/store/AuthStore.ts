import { makeAutoObservable } from 'mobx';
import AuthService from '../services/AuthService.ts';
import VkAuthService, { VkLoginAndroidDto } from '../services/VkAuthService.ts';
import { v4 as uuidv4 } from 'uuid';
import UserService, { AddFcmDeviceTokenDto, UpdateUserDto, User } from '../services/UserService.ts';
import { IUserVk } from '../models/IUserVk.ts';
import {
	BLOCKED_ROUTE,
	LOCAL_STORAGE_DEVICE,
	LOCAL_STORAGE_END_READ_MESSAGE_ID,
	LOCAL_STORAGE_TOKEN,
	PERSONALE_ROUTE,
	REDIRECT_URI,
	REGISTRATION_ROUTE,
	RESTORE_PROFILE_ROUTE,
	VK_CLIENT_ID,
} from '../utils/consts.tsx';
import AdminService from '../services/AdminService.ts';
import { TokenStorage } from '../services/TokenStorage.ts';
import { Browser } from '@capacitor/browser';

export default class AuthStore {
	user = {} as User;
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

	setUser = (user: User) => {
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
			await TokenStorage.removeRefresh();
			this.setAuth(false);
			this.setUser({} as User);
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
			this.setUser({} as User);
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
				localStorage.removeItem(LOCAL_STORAGE_TOKEN);
				localStorage.removeItem(LOCAL_STORAGE_DEVICE);
				return;
			}
			// if (response.data.) {
			// 	this.setError(true);
			// 	this.setMessageError(response.data.error.message);
			// 	this.setAuth(false);
			// 	// localStorage.removeItem(LOCAL_STORAGE_TOKEN);
			// 	// localStorage.removeItem(LOCAL_STORAGE_DEVICE);
			// 	return;
			// }
			localStorage.setItem(LOCAL_STORAGE_TOKEN, response.data.token);
			await TokenStorage.setRefresh(response.data.refreshToken);

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
				await TokenStorage.removeRefresh();
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

	getPkceCode = async () => {
		try {
			const pkce = await VkAuthService.getPkcecode();
			if (pkce.data) return pkce.data;
		} catch (err) {
			console.log(`Ошибка в getPkceCode: ${err}`);
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

	registrVkAndroid = async (payload: VkLoginAndroidDto) => {
		try {
			const response = await VkAuthService.registrVkAndroid(payload);
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

	registration = async (payload: {}, navigate: (path: string, options?: any) => void) => {
		const registrVk = await this.registrationVk(payload);
		if (!registrVk?.data) return;
		if (registrVk.data.isDelProfile) {
			this.setDelProfile(true);
			navigate(RESTORE_PROFILE_ROUTE, {
				state: { user: registrVk.data },
			});
		} else if (!registrVk.data.isRegistration && registrVk.data.blockedforever) {
			return navigate(BLOCKED_ROUTE);
		} else if (!registrVk.data.isRegistration && registrVk.data.id) {
			this.setIsCondition(true);
			this.setUser(registrVk.data);
			navigate(REGISTRATION_ROUTE);
		} else if (registrVk.data.isRegistration && registrVk.data.id) {
			await this.loginVk(registrVk.data.id, registrVk.data.secret);
			navigate(PERSONALE_ROUTE);
		}
	};

	androidRegistration = async (payload: VkLoginAndroidDto, navigate: (path: string, options?: any) => void) => {
		const registrVk = await this.registrVkAndroid(payload);

		if (!registrVk?.data) return;
		if (registrVk.data.isDelProfile) {
			this.setDelProfile(true);
			navigate(RESTORE_PROFILE_ROUTE, {
				state: { user: registrVk.data },
			});
		} else if (!registrVk.data.isRegistration && registrVk.data.blockedforever) {
			return navigate(BLOCKED_ROUTE);
		} else if (!registrVk.data.isRegistration && registrVk.data.id) {
			this.setIsCondition(true);
			this.setUser(registrVk.data);
			navigate(REGISTRATION_ROUTE);
		} else if (registrVk.data.isRegistration && registrVk.data.id) {
			await this.loginVk(registrVk.data.id, registrVk.data.secret);
			navigate(PERSONALE_ROUTE);
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
			await TokenStorage.setRefresh(response.data.refreshToken);

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

	getUser = async (id: number) => {
		try {
			const profile = await UserService.getUser(id);
			return { data: profile.data };
		} catch (e: any) {
			return { data: e.response?.data?.message };
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

	loginWithVkMobile = async () => {
		try {
			const pkce = await this.getPkceCode();

			if (pkce) {
				localStorage.setItem('vk_pkce_code_verifier', pkce.code_verifier);
				localStorage.setItem('vk_auth_state', pkce.state);
			}

			const authUrl = `https://id.vk.ru/authorize?client_id=${VK_CLIENT_ID}&redirect_uri=${encodeURIComponent(
				REDIRECT_URI
			)}&response_type=code&code_challenge=${pkce?.code_challenge}&code_challenge_method=S256&state=${pkce?.state}`;

			await Browser.open({ url: authUrl });
		} catch (error) {
			console.error(error, 'error in loginWithVkMobile');
		}
	};

	addFcmDeviceToken = async (dto: AddFcmDeviceTokenDto) => {
		try {
			return await UserService.addFcmUserToken(dto);
		} catch (e: any) {
			console.error(e.response?.data?.message, 'error in addFcmDeviceToken');
			return { data: e.response?.data?.message };
		}
	};
}
