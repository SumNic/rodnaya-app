import axios from "axios";
import { makeAutoObservable } from "mobx";
import { API_URL } from "../http";
import { IUser } from "../models/IUser";
import { AuthResponse } from "../models/response/AuthResponse";
import AuthService from "../services/AuthService";
import OAuthVkService from "../services/OAuthVkService";
import { LocationUser } from "../models/LocationUser";
import LocationUserService from "../services/LocationUserService";

export default class Store {
    user = {} as IUser
    isAuth = false
    isAuthVk = false
    isCondition = false
    country = [] as LocationUser[]
    region = [] as LocationUser[]
    locality = [] as LocationUser[]

    constructor() {
        makeAutoObservable(this)
    }

    setAuth(bool: boolean) {
        this.isAuth = bool
    }

    setUser(user: IUser) {
        this.user = user
    }

    setAuthVk(bool: boolean) {
        this.isAuthVk = bool
    }

    setIsCondition(bool: boolean) {
        this.isCondition = bool
    }

    setCountry (country: LocationUser[]) {
        this.country = country
    }

    setRegion (region: LocationUser[]) {
        this.region = region
    }

    setLocality (locality: LocationUser[]) {
        this.locality = locality
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password)
            console.log(response);
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }

    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password)
            console.log(response);            
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout()
            localStorage.removeItem('token')
            this.setAuth(false)
            this.setUser({} as IUser)
        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }

    async checkAuth() {
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            console.log(response);            
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e: any) {
            console.log(e.response?.data?.message)
        }
    }

    async registrationVk() {
        try {
            const response = await OAuthVkService.registrationVk()
            console.log(response);           
            // localStorage.setItem('token', response.data.accessToken)
            this.setAuthVk(true)
            // this.setUser(response.data.user)
        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }

    async getCondition() {
        try {
            const response = await AuthService.logout()
            localStorage.removeItem('token')
            this.setAuth(false)
            this.setUser({} as IUser)
        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }

    async getCountry() {
        try {
            const response = await LocationUserService.fetchCountryUsers()
            this.setCountry(response.data)

        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }

    async getRegion(country: string) {
        try {
            const response = await LocationUserService.fetchRegionUsers(country)
            this.setRegion(response.data)

        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }

    async getLocality(region: string) {
        try {
            const response = await LocationUserService.fetchLocalityUsers(region)
            this.setLocality(response.data)

        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }

    async saveLocation(country: string, region: string, locality: string) {
        try {
            const response = await LocationUserService.fetchLocalitionUsers(country, region, locality)
            // console.log(response);            
            // localStorage.setItem('token', response.data.accessToken)
            // this.setAuth(true)
            // this.setUser(response.data.user)
            return response
            
        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }
}