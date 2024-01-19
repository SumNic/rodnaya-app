import axios from "axios";
import { makeAutoObservable } from "mobx";
import { API_URL } from "../http";
import { IUser } from "../models/IUser";
import { AuthResponse } from "../models/response/AuthResponse";
import AuthService from "../services/AuthService";
import OAuthVkService from "../services/VkAuthService";
import { LocationUser } from "../models/LocationUser";
import LocationUserService from "../services/LocationUserService";
import { VkSdkResponse } from "../models/response/VkSdkResponse";
import { useNavigate } from "react-router-dom";
import { VK_CALLBACK_ROUTE } from "../utils/consts";

export default class Store {
    user = {} as IUser
    isAuth = false
    isAuthVk = false
    isCondition = false
    isError = false
    isMessageError = ''
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

    setError(bool: boolean) {
        this.isError = bool
    }
    setMessageError(str: string) {
        this.isMessageError = str
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

    async registrationVk(payload: any) {
        try {
            const response = await OAuthVkService.registrationVk(payload)
          
          if (response.data.error) {
            console.log(response.data.error, 'react_response_error')
            return { error: response.data.error }
          } else if (response.data.response) {
            console.log(response.data.response[0], 'react_response_data')
            this.setAuth(true)
            return { user: response.data.response[0] }

          }
        } catch(e: any) {
            return { error: e.response?.data?.message }
            // console.log(e.response?.data?.message)
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