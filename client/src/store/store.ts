import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import VkAuthService from "../services/VkAuthService";
import { ResidencyUser } from "../models/ResidencyUser";
import LocationUserService from "../services/LocationService";
import { LocationUser } from "../models/LocationUser";
import { v4 as uuidv4 } from "uuid";

export default class Store {
    user = {} as IUser
    isAuth = false
    isAuthVk = false
    isCondition = false
    isRegistrationEnd = false
    isError = false
    isMessageError = ''
    country = [] as LocationUser[]
    region = [] as LocationUser[]
    locality = [] as LocationUser[]
    uuid = uuidv4()
    load = true

    constructor() {
        this.uuid = uuidv4()
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

    setRegistrationEnd(bool: boolean) {
        this.isRegistrationEnd = bool
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

    setLoad(bool: boolean) {
        this.load = bool
    }

    // async login(email: string, password: string) {
    //     try {
    //         const response = await AuthService.login(email, password)
    //         console.log(response);
    //         localStorage.setItem('token', response.data.accessToken)
    //         this.setAuth(true)
    //         this.setUser(response.data.user)
    //     } catch(e: any) {
    //         console.log(e.response?.data?.message)
    //     }
    // }

    // async registration(email: string, password: string) {
    //     try {
    //         const response = await AuthService.registration(email, password)
    //         // console.log(response);            
    //         localStorage.setItem('token', response.data.accessToken)
    //         this.setAuth(true)
    //         this.setUser(response.data.user)
    //     } catch(e: any) {
    //         console.log(e.response?.data?.message)
    //     }
    // }

    async logout(allDeviceExit: boolean) {
        try {
            
            let uuid: string | null = localStorage.getItem('device')
            await AuthService.logout(this.user.id, uuid, allDeviceExit)
            localStorage.removeItem('token')
            this.setAuth(false)
            this.setUser({} as IUser)
        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }

    async checkAuth() {
        try {
            let device: string | null = localStorage.getItem('device')
            const response = await AuthService.updateRegistration(device)
            if (!response.data) {
                this.setMessageError('Произошла ошибка на сервере. Повторите ошибку позже.')
                this.setAuth(false)
                return
            }
            localStorage.setItem('token', response.data.token)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e: any) {
            console.log(e.response?.data?.message)
        } finally {
            this.setLoad(false)
        }
    }

    async registrationVk(payload: any) {
        try {
            const response = await VkAuthService.registrationVk(payload)
            return {data: response.data}
        } catch(e: any) {
            return { data: e.response?.data?.message }
        }
    }

    async loginVk(id: number, secret: string) {
        try {
            if(!localStorage.getItem('device')) {                
                localStorage.setItem('device', this.uuid)
            } 

            let device: any = localStorage.getItem('device')
            
            const response = await AuthService.setRegistration(id, secret, device)
            localStorage.setItem('token', response.data.token)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch(e: any) {
            return { data: e.response?.data?.message }
        }
    }

    // async getCondition() {
    //     try {
    //         await AuthService.logout()
    //         localStorage.removeItem('token')
    //         this.setAuth(false)
    //         this.setUser({} as IUser)
    //     } catch(e: any) {
    //         console.log(e.response?.data?.message)
    //     }
    // }

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

    async saveResidency(dto: ResidencyUser) {
        try {
            const response = await AuthService.createResidencyUsers(dto)
            return response
            
        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }
}