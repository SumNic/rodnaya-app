import { makeAutoObservable } from 'mobx';
import { IFiles } from '../models/IFiles.ts';

export default class FilesStore {
	files = [] as IFiles[];
	progressLoadValue: number = 0;
	nameFile = '';

	constructor() {
		makeAutoObservable(this);
	}

	setFiles(file: IFiles) {
		this.files.push(file);
	}

	resetFiles() {
		this.files = [] as IFiles[];
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
}
