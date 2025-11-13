import { AxiosResponse } from 'axios';
import $api from '../api_http';
import { components } from '../utils/api';

export type Files = components['schemas']['Files'];

export default class FileService {
	static async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<AxiosResponse<Files>> {
		const formData = new FormData();
		formData.append('file', file);

		return $api.post('/upload-files', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
			onUploadProgress: (progressEvent: any) => {
				const total = progressEvent.total || 1;
				const percent = Math.min((progressEvent.loaded / total) * 100, 100);
				if (onProgress) onProgress(percent);
			},
		});
	}
}
