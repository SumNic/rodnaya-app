import { useState } from 'react';
import { AxiosResponse } from 'axios';
import $api from '../api_http/index';
import { components } from '../utils/api';

export type Files = components['schemas']['Files'];

export function useUploadForm(url: string) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [progress, setProgress] = useState<number>(0);

	const uploadForm = async (formData: FormData): Promise<AxiosResponse<Files>> => {
		setProgress(0);
		setIsLoading(true);
		const response = await $api.post(url, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			onUploadProgress: (progressEvent: any) => {
				const totalLength = progressEvent.total || 0;
				if (totalLength !== null && totalLength <= 20000000) {
					const progress = (progressEvent.loaded / progressEvent.total) * 80;
					setProgress(progress);
				}
			},
		});
		setProgress(100);
		return response;
	};

	return { uploadForm, isLoading, progress };
}
