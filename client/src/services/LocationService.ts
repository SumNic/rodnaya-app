import { AxiosResponse } from "axios";
import $api from "../http";
import { LocationUser } from "../models/LocationUser";

export default class LocationUserService {
    static async fetchCountryUsers(): Promise<AxiosResponse<LocationUser[]>> {
        return $api.get<LocationUser[]>('/country')
    }

    static async fetchRegionUsers(country: string): Promise<AxiosResponse<LocationUser[]>> {
        return $api.get<LocationUser[]>('/region/' + country)
    }

    static async fetchLocalityUsers(region: string): Promise<AxiosResponse<LocationUser[]>> {
        return $api.get<LocationUser[]>('/locality/' + region)
    }    
}