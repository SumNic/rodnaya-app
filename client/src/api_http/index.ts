import axios from 'axios';
import { API_URL, LOCAL_STORAGE_DEVICE, LOCAL_STORAGE_TOKEN } from '../utils/consts';
import { TokenStorage } from '../services/TokenStorage';
import AuthService from '../services/AuthService';

const $api = axios.create({
	withCredentials: true,
	baseURL: API_URL,
});

$api.interceptors.request.use(async (config) => {
	const accessToken = localStorage.getItem(LOCAL_STORAGE_TOKEN);
	const refreshToken = await TokenStorage.getRefresh();

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	if (refreshToken) {
		config.headers['x-refresh-token'] = refreshToken; // кастомный заголовок
	}
	return config;
});

$api.interceptors.response.use(
	(res) => res,
	async (err) => {
		const originalRequest = err.config;

		if (!err.response) {
			return Promise.reject(err);
		}

		const device: string | null = localStorage.getItem(LOCAL_STORAGE_DEVICE);

		// Обработка 401 ошибки (токен истек)
		if (err.response.status === 401 && !originalRequest._retry && device) {
			originalRequest._retry = true;

			try {
				const res = await AuthService.updateRegistration(device);

				localStorage.setItem(LOCAL_STORAGE_TOKEN, res.data.token);
				await TokenStorage.setRefresh(res.data.refreshToken);

				// Обновляем заголовки
				originalRequest.headers['Authorization'] = `Bearer ${res.data.token}`;
				originalRequest.headers['x-refresh-token'] = res.data.refreshToken;

				return $api.request(originalRequest);
			} catch (e) {
				return Promise.reject(e);
			}
		}
		return Promise.reject(err);
	}
);

export default $api;
