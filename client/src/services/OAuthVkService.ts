import $api from "../http";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { useNavigate } from "react-router-dom";
import { VK_CALLBACK_ROUTE } from "../utils/consts";

// Config.init({
//   appId: 51729608, // Тут нужно подставить ID своего приложения.

//   appSettings: {
//     agreements: '',
//     promo: '',
//     vkc_behavior: '',
//     vkc_auth_action: '',
//     vkc_brand: '',
//     vkc_display_mode: '',
//   },
// });

export default class OAuthVkService {

    // static async registrationVk(payload: any) {
    //       return payload
    //     //   Connect.redirectAuth({ url: 'http://localhost/vk/callback', state: 'dj29fnsadjsd82'});
    // }

    static async registrationVk(payload: any): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/loginByVk', payload)
    }

    // static async redirectVk() {
    //     const navigate = useNavigate()
    //     return navigate(VK_CALLBACK_ROUTE, {replace: true});
    // }
}