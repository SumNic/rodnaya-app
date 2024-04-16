import axios from 'axios'
import { config } from 'process'

export const API_URL = ' http://localhost:5000/api'

const $api_files = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api_files.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

const myHeaders = new Headers();
myHeaders.append('Content-Type', 'multipart/form-data');

export default $api_files