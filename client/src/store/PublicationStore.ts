import { makeAutoObservable } from 'mobx';
import { SendedMessage } from '../models/SendedMessage.ts';
import PublicationsService from '../services/PublicationsService.ts';
import { PublicationWebsocketResponse } from '../models/response/PublicationWebsocketResponse.ts';
import { LocationUser } from '../models/LocationUser.ts';

export default class PublicationStore {
	publictionDataSocket: PublicationWebsocketResponse | undefined = undefined;

	constructor() {
		makeAutoObservable(this);
	}

	async addPublication(dto: SendedMessage) {
		try {
			const response = await PublicationsService.sendPublication(dto);
			return { data: response.data };
		} catch (e: any) {
			return { error: e.response?.data?.message };
		}
	}

	setPublicationDataSocket(publictionDataSocket: PublicationWebsocketResponse | undefined) {
		if (publictionDataSocket) this.publictionDataSocket = publictionDataSocket;
	}

	async getAllPublications(territory: LocationUser, pageNumber: number) {
		try {
			const response = await PublicationsService.getAllPublications(territory, pageNumber);
			return { data: response.data };
		} catch (e: any) {
			console.log(e.response?.data?.message);
		}
	}

	async getOnePublication(id: number) {
		try {
			const response = await PublicationsService.getPublicationFromId(id);
			return { data: response.data };
		} catch (e: any) {
			console.log(e.response?.data?.message);
		}
	}

	async getUserPublications(id: number, pageNumber: number) {
		try {
			const response = await PublicationsService.getUserPublications(id, pageNumber);
			return { data: response.data };
		} catch (e: any) {
			console.log(e.response?.data?.message);
		}
	}
}
