import { makeAutoObservable } from 'mobx';
import CommonService, { MobileAppInfoDto } from '../services/CommonService';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export default class CommonStore {
	commonInfo: MobileAppInfoDto = {} as MobileAppInfoDto;
	isCommonInfoModal: boolean = false;

	constructor() {
		makeAutoObservable(this);
	}

	setIsCommonInfoModal = (value: boolean) => {
		this.isCommonInfoModal = value;
	};

	setCommonInfo = (value: MobileAppInfoDto) => {
		this.commonInfo = value;
	};

	addVersionMobileApp = async (versionApp: string) => {
		try {
			await CommonService.addVersion({ versionApp });
		} catch (e: any) {
			console.log(e.response?.data?.message);
		}
	};

	getInfo = async () => {
		try {
			const res = await CommonService.getInfo();

			if (!res.data) {
				this.setIsCommonInfoModal(false);
				return;
			}
			if (Capacitor.isNativePlatform()) {
				const info = await App.getInfo();
				if (info.version && res.data.version && info.version !== res.data.version) {
					this.setIsCommonInfoModal(true);
				}
			}

			this.setCommonInfo(res.data);
		} catch (e: any) {
			console.log(e.response?.data?.message);
		}
	};
}
