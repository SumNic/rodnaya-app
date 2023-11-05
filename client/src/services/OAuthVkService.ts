import $api from "../http";
import { Config, Connect, ConnectEvents } from '@vkontakte/superappkit';

Config.init({
  appId: 51729608, // Тут нужно подставить ID своего приложения.

  appSettings: {
    agreements: '',
    promo: '',
    vkc_behavior: '',
    vkc_auth_action: '',
    vkc_brand: '',
    vkc_display_mode: '',
  },
});

export default class OAuthVkService {

    static async registrationVk() {
          return Connect.redirectAuth({ url: 'http://localhost/vk/callback', state: 'dj29fnsadjsd82'});
    }
}