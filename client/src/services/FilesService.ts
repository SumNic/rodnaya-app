import { AxiosResponse } from "axios";
import $api_files from "../http/index_files";

export default class FilesService {

    static async uploadFile(file: any): Promise<AxiosResponse<any>> {
        return $api_files.post<any>('/upload-files', file, {
            onUploadProgress: (progressEvent) => {
            const totalLength = progressEvent.total || 0
            console.log("onUploadProgress", totalLength);
            if (totalLength !== null) {
                // this.updateProgressBarValue(Math.round((progressEvent.loaded * 100) / totalLength));
                const prog = Math.round((progressEvent.loaded * 100) / totalLength)
                console.log(progressEvent.loaded, 'progressEvent.loaded')
                console.log(progressEvent.progress, 'progressEvent.progress')
                console.log(prog)
            }
        }
       })
    }
}