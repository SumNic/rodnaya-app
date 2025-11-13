import { makeAutoObservable, runInAction } from 'mobx';
import { UploadFile } from 'antd';
import { Files } from '../hooks/useUploadForm';
import FileService from '../services/FileService';

export default class FilesStore {
	files: Files[] = [];
	progressLoadValue = 0;
	nameFile = '';
	isLoading = false;

	constructor() {
		makeAutoObservable(this);
	}

	setFiles = (file: Files) => {
		this.files.push(file);
	};

	resetFiles = () => {
		this.files = [];
		this.progressLoadValue = 0;
		this.nameFile = '';
		this.isLoading = false;
	};

	createFiles = (files: Files[]) => {
		this.files = files;
	};

	setProgressLoadValue = (nbr: number) => {
		this.progressLoadValue = nbr;
	};

	setNameFile = (str: string) => {
		this.nameFile = str;
	};

	setIsLoading = (value: boolean) => {
		this.isLoading = value;
	};

	uploadFile = async (file: File) => {
		this.setIsLoading(true);
		this.setProgressLoadValue(0);

		try {
			const response = await FileService.uploadFile(file, (progress) => {
				runInAction(() => {
					this.progressLoadValue = progress;
				});
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
			return { data: error.response?.data?.message };
		}
	};

	removeFile = (file: UploadFile) => {
		try {
			const newStoreFiles = this.files.filter((item) => item.fileName !== file.originFileObj?.name);
			this.createFiles(newStoreFiles);
			return { data: newStoreFiles };
		} catch (error: any) {
			console.error(`Ошибка в removeFile: ${error}`);
			return { error };
		}
	};
}
