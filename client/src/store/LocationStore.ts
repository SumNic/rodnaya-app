import { makeAutoObservable } from 'mobx';
import { ResidencyUser } from '../models/ResidencyUser.ts';
import { LocationUser } from '../models/LocationUser.ts';
import { ResidencyResponse } from '../models/response/ResidencyResponse.ts';
import LocationService from '../services/LocationService.ts';

export default class LocationStore {
	country = [] as LocationUser[];
	region = [] as LocationUser[];
	locality = [] as LocationUser[];
	isResidency = [] as ResidencyResponse[];
	territory = {} as LocationUser;

	constructor() {
		makeAutoObservable(this);
		this.setSelectCountry = this.setSelectCountry.bind(this)
		this.setSelectRegion = this.setSelectRegion.bind(this)
		this.setSelectLocality = this.setSelectLocality.bind(this)
	}

	setCountry(country: LocationUser[]) {
		this.country = country;
	}

	setRegion(region: LocationUser[]) {
		this.region = region;
	}

	setLocality(locality: LocationUser[]) {
		this.locality = locality;
	}

	setSelectCountry(country: string) {
		this.territory = { ...this.territory, country };
	}

	setSelectRegion(region: string) {
		this.territory = { ...this.territory, region };
	}

	setSelectLocality(locality: string) {
		this.territory = { ...this.territory, locality };
	}

	setResidency(isResidency: ResidencyResponse[]) {
		this.isResidency = isResidency;
	}

	async getCountry() {
		try {
			const response = await LocationService.fetchCountryUsers();
			this.setCountry(response.data);
		} catch (e: any) {
			console.log(e.response?.data?.message);
		}
	}

	async getRegion(country: string) {
		try {
			const response = await LocationService.fetchRegionUsers(country);
			this.setRegion(response.data);
		} catch (e: any) {
			console.log(e.response?.data?.message);
		}
	}

	async getLocality(region: string) {
		try {
			const response = await LocationService.fetchLocalityUsers(region);
			this.setLocality(response.data);
		} catch (e: any) {
			console.log(e.response?.data?.message);
		}
	}

	async saveResidency(dto: ResidencyUser) {
		try {
			const response = await LocationService.createResidencyUsers(dto);
			return { data: response.data };
		} catch (e: any) {
			return { error: e.response?.data?.message };
		}
	}

	async getAllResidencys() {
		try {
			const response = await LocationService.getResidencyUsers();
			this.setResidency(response.data);
			return response;
		} catch (e: any) {
			console.log(e.response?.data?.message);
		}
	}
}
