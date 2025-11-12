import { makeAutoObservable, runInAction } from 'mobx';
import { IFiles } from '../models/IFiles';
import $api from '../api_http';
import { UploadFile } from 'antd';

export default class FilesStore {
	files: IFiles[] = [];
	progressLoadValue = 0;
	nameFile = '';
	isLoading = false;

	constructor() {
		makeAutoObservable(this);
	}

	setFiles(file: IFiles) {
		this.files.push(file);
	}

	resetFiles() {
		this.files = [];
		this.progressLoadValue = 0;
		this.nameFile = '';
		this.isLoading = false;
	}

	createFiles(files: IFiles[]) {
		this.files = files;
	}

	setProgressLoadValue(nbr: number) {
		this.progressLoadValue = nbr;
	}

	setNameFile(str: string) {
		this.nameFile = str;
	}

	setIsLoading(value: boolean) {
		this.isLoading = value;
	}

	// Новый метод для загрузки файлов
	async uploadFile(url: string, file: File) {
		this.setIsLoading(true);
		this.setProgressLoadValue(0);

		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await $api.post(url, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
				onUploadProgress: (progressEvent: any) => {
					const total = progressEvent.total || 1;
					runInAction(() => {
						this.progressLoadValue = Math.min((progressEvent.loaded / total) * 100, 100);
					});
				},
			});

			if (response.status === 201) {
				runInAction(() => {
					this.setFiles(response.data);
					this.setIsLoading(false);
					this.setProgressLoadValue(100);
				});
			}
			return { data: response.data };
		} catch (error: any) {
			runInAction(() => {
				this.setIsLoading(false);
			});
			console.error('Ошибка загрузки файла:', error);
			return { error };
		}
	}

	removeFile(file: UploadFile) {
		try {
			const newStoreFiles = this.files.filter((item) => item.fileName !== file.originFileObj?.name);
			this.createFiles(newStoreFiles);
			return { data: newStoreFiles };
		} catch (error: any) {
			console.error(`Ошибка в removeFile: ${error}`);
			return { error };
		}
	}
}
