import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import VkAuthService from "../services/VkAuthService";
import { ResidencyUser } from "../models/ResidencyUser";
import LocationUserService from "../services/LocationService";
import { LocationUser } from "../models/LocationUser";
import { v4 as uuidv4 } from "uuid";
import ResidencyService from "../services/ResidencyService";
import { ResidencyResponse } from "../models/response/ResidencyResponse";
import UserService from "../services/UserService";
import { DeclarationUser } from "../models/DeclarationUser";
import MessagesService from "../services/MessagesService";
import { IFiles } from "../models/IFiles";
import { MessageForm } from "../models/MessageForm";
import { IUserVk } from "../models/IUserVk";
import { CountNoReadMessages } from "../models/CountNoReadMessages";

export default class Store {
    user = {} as IUser
    userFromVk = {} as IUserVk
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
    isResidency = [] as ResidencyResponse[]
    cancelAction = false // используется для закрытия окна редактирования в Personale_page
    declaration = ''
    isDelProfile = false
    files = [] as IFiles[]
    progressLoadValue: number = 0
    newMessage = false
    nameFile = ''
    arrCountMessages: CountNoReadMessages[] = []

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

    setUserFromVk(userFromVk: IUserVk) {
        this.userFromVk = userFromVk
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

    setCountry(country: LocationUser[]) {
        this.country = country
    }

    setRegion(region: LocationUser[]) {
        this.region = region
    }

    setLocality(locality: LocationUser[]) {
        this.locality = locality
    }

    setLoad(bool: boolean) {
        this.load = bool
    }

    setResidency(isResidency: ResidencyResponse[]) {
        this.isResidency = isResidency
    }

    setCancelAction(bool: boolean) {
        this.cancelAction = bool
    }

    setDeclaration(str: string) {
        this.declaration = str
    }

    setDelProfile(bool: boolean) {
        this.isDelProfile = bool
    }

    setFiles(file: IFiles) {
        this.files.push(file)
    }

    resetFiles() {
        this.files = [] as IFiles[]
    }

    setProgressLoadValue(nbr: number) {
        this.progressLoadValue = nbr
    }

    setNewMessage(bool: boolean) {
        this.newMessage = bool
    }

    setNameFile(str: string) {
        this.nameFile = str
    }

    setArrCountMessages(location: string, count: number) {
        let result = this.arrCountMessages.find(item => item.location === location)
        if (result) {
            return this.arrCountMessages.map(elem => {
                if (elem.location === location) elem.count = count
            })
        }
        this.arrCountMessages.push({location, count})
    }

    async logout(allDeviceExit: boolean) {
        try {
            
            let uuid: string | null = localStorage.getItem('device')
            await AuthService.logout(this.user.id, uuid, allDeviceExit)
            localStorage.removeItem('token')
            localStorage.removeItem('device')
            this.setAuth(false)
            this.setUser({} as IUser)
        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }

    async deleteProfile(id: number, secret: string) {
        try {
            await AuthService.deleteProfile(id, secret)
            localStorage.removeItem('token')
            localStorage.removeItem('device')
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
                this.setError(true)
                this.setMessageError('Произошла ошибка на сервере. Повторите ошибку позже.')
                this.setAuth(false)
                return
            }
            if (response.data.error) {
                this.setError(true)
                this.setMessageError(response.data.error.message)
                this.setAuth(false)
                return
            }
            localStorage.setItem('token', response.data.token)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e: any) {
            console.log(e, 'error')
            console.log(e.response?.data?.message)
        } finally {
            this.setLoad(false)
        }
    }

    async registrationVk(payload: any) {
        try {
            const response = await VkAuthService.registrationVk(payload)
            if (!response.data) {
                this.setError(true)
                this.setMessageError('Произошла ошибка на сервере. Повторите ошибку позже.')
                this.setAuth(false)
                return
            }
            if (response.data.error) {
                this.setError(true)
                this.setMessageError(response.data.error.message)
                this.setAuth(false)
                return
            }
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
            if (!response.data) {
                this.setError(true)
                this.setMessageError('Произошла ошибка на сервере. Повторите ошибку позже.')
                this.setAuth(false)
                return
            }
            if (response.data.error) {
                this.setError(true)
                this.setMessageError(response.data.error.message)
                this.setAuth(false)
                return
            }
            localStorage.setItem('token', response.data.token)
            console.log(response.data.user, 'response.data.user')
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch(e: any) {
            return { data: e.response?.data?.message }
        }
    }

    async restoreProfile(id: number, secret: string) {
        try {
            const response = await AuthService.restoreProfile(id, secret)
            this.setDelProfile(response.data) 
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

    async saveResidency(dto: ResidencyUser) {
        try {
            const response = await AuthService.createResidencyUsers(dto)
            return response
            
        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }

    async getAllResidencys() {
        try {
            const response = await ResidencyService.getResidencyUsers()
            this.setResidency(response.data)
            return response
            
        } catch(e: any) {
            console.log(e.response?.data?.message)
        }
    }

    async addDeclaration(form: any) {
        try {            
            const response = await UserService.addDeclaration(form)
            this.setUser(response.data)
        } catch(e: any) {
            return { data: e.response?.data?.message }
        }
    }

    async getDeclaration(id: number) {
        try {            
            const declaration = await UserService.getDeclaration(id)
            this.setDeclaration(declaration.data.declaration)
        } catch(e: any) {
            return { data: e.response?.data?.message }
        }
    }
    
    async udatePersonaleData(secret: string, form: any) {
        try {            
            const response = await UserService.udatePersonaleData(secret, form)
            this.setUser(response.data)
        } catch(e: any) {
            return { data: e.response?.data?.message }
        }
    }

    async sendMessage(id_user: number, secret: string, location: string, form: MessageForm) {
        try {            
            const response = await MessagesService.sendMessage(id_user, secret, location, form)
            return response.data
        } catch(e: any) {
            return { data: e.response?.data?.message }
        }
    }
}