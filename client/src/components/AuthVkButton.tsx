import { HOST, VK_CALLBACK_ROUTE } from "../utils/consts";
import * as VKID from "@vkid/sdk";
import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { useEffectOnce } from "../hooks/useEffectOnce";

/**
 * Функциональный компонент, который отображает кнопку авторизации ВКонтакте с использованием VKID SDK.
 * @component
 * @returns {JSX.Element} - JSX-элемент, представляющий кнопку авторизации ВКонтакте.
 */
function AuthVkButton() {
    console.log(HOST, 'HOST');
    /**
     * Ссылка на HTML-элемент, в котором будет отображаться кнопка авторизации ВКонтакте.
     */
    const ref: any = useRef(null);

    /**
     * Экземпляр VKID.OneTap для обработки авторизации ВКонтакте.
     */
    const oneTap = new VKID.OneTap();

    /**
     * Функция, которая отображает кнопку авторизации ВКонтакте с использованием указанной ссылки.
     */
    const container = () => {
        oneTap?.render({ container: ref.current });
    };

    /**
     * Хук, который выполняет функцию `container` только один раз, при монтировании компонента.
     */
    useEffectOnce(() => container());

    /**
     * Настраивает VKID SDK с необходимыми параметрами.
     */
    VKID.Config.set({
        // Идентификатор приложения.
        app: 51729608,
        // URL для перенаправления после авторизации.
        redirectUrl: `${HOST}${VK_CALLBACK_ROUTE}`,
    });

    /**
     * Отображает HTML-элемент, в котором будет расположена кнопка авторизации ВКонтакте.
     */
    return <div ref={ref} id="my-element"></div>;
}

export default observer(AuthVkButton);
