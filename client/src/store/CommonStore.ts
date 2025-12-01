import { makeAutoObservable } from 'mobx';
import CommonService from '../services/CommonService';

export default class CommonStore {
	commonInfo: any;
	isCommonInfoModal: boolean = false;

	constructor() {
		makeAutoObservable(this);
	}

	setIsCommonInfoModal = (value: boolean) => {
		this.isCommonInfoModal = value;
	};

	setCommonInfo = (value: any) => {
		this.commonInfo = value;
	};

	getInfo = async () => {
		try {
			const res = await CommonService.getInfo();
			console.log(res.data, 'res.data');

			if (!res.data) {
				this.setIsCommonInfoModal(false);
				return;
			}
			this.setIsCommonInfoModal(true);
			this.setCommonInfo(res.data);
		} catch (e: any) {
			console.log(e.response?.data?.message);
		}
	};
}
