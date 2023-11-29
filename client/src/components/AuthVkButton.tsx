import {useRef, useEffect} from 'react';
import { Config, Connect, ConnectEvents, VKAuthButtonCallbackResult } from '@vkontakte/superappkit'; 
import { useNavigate } from 'react-router-dom';
import { VK_CALLBACK_ROUTE } from '../utils/consts';

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

function AuthVkButton(): any {
 
  const navigate = useNavigate();

  const ref: any = useRef(null);

        useEffect(() => {
          ref.current.appendChild(oneTapButton?.getFrame());
        });

        
  
const oneTapButton = Connect.buttonOneTapAuth({
  callback: (event: VKAuthButtonCallbackResult) => {
    
    const { type } = event;

    if (!type) {
      return;
    }

    switch (type) {
      case ConnectEvents.OneTapAuthEventsSDK.LOGIN_SUCCESS: // = 'VKSDKOneTapAuthLoginSuccess'
        console.log(event);
        return navigate(VK_CALLBACK_ROUTE, {replace: true});
    }

    return;
  },
  // Не обязательный параметр с настройками отображения OneTap
  options: {
    showAlternativeLogin: false,
    showAgreements: true,
    displayMode: 'default',
    langId: 0,
    buttonStyles: {
      borderRadius: 10,
      height: 40,
    },
  },
});

// Получить iframe можно с помощью метода getFrame()

    
    
    console.log(oneTapButton, 'oneTapButton')
    if (oneTapButton) {
        // Фрэйм с кнопкой можно передать в любой элемент
        // document.getElementById('id').appendChild(oneTapButton.getFrame());
        

        return (
          <p ref={ref} id="my-element"></p >
        );
        
      }
      
}


// Удалить iframe можно с помощью OneTapButton.destroy();

export default AuthVkButton;
