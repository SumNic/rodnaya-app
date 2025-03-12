import { makeAutoObservable } from 'mobx';

export default class GroupStore {
    isModalNewWorkgroupOpen: boolean = false;

	constructor() {
		makeAutoObservable(this);
	}

    setIsModalNewWorkgroupOpen(bool: boolean) {
        this.isModalNewWorkgroupOpen = bool;
    }
}