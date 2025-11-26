import axios from 'axios';
import { API_URL, LOCAL_STORAGE_TOKEN } from '../utils/consts';
import { TokenStorage } from '../services/TokenStorage';

const $api = axios.create({
	withCredentials: true,
	baseURL: API_URL,
});

$api.interceptors.request.use(async (config) => {
	const accessToken = localStorage.getItem(LOCAL_STORAGE_TOKEN);
	const refreshToken = await TokenStorage.getRefresh();
	console.log(accessToken, refreshToken, 'accessToken, refreshToken');

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	if (refreshToken) {
		config.headers['x-refresh-token'] = refreshToken; // кастомный заголовок
	}
	return config;
});

export default $api;
