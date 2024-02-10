import { LOCALHOST, VK_CALLBACK_ROUTE } from '../utils/consts';
import * as VKID from '@vkid/sdk'; 
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';

function AuthVkButton() {

  const ref: any = useRef(null)

  useEffect(() => {
    oneTap.render({ container: ref.current })
  })

  const oneTap = new VKID.OneTap()

  VKID.Config.set({
    // Идентификатор приложения.
    app: 51729608,
    // Адрес для перехода после авторизации
    redirectUrl: `${LOCALHOST}${VK_CALLBACK_ROUTE}`,
  });
  
  return (
    <div ref={ref} id="my-element"></div >    
  )
}

export default observer(AuthVkButton);
