import { HOST, VK_CALLBACK_ROUTE, VK_ID_APP } from '../utils/consts';
import * as VKID from '@vkid/sdk';
import { observer } from 'mobx-react-lite';
import React, { useRef } from 'react';
import { useEffectOnce } from '../hooks/useEffectOnce';

const AuthVkButton: React.FC = () => {
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
		app: VK_ID_APP,
		// URL для перенаправления после авторизации.
		redirectUrl: `${HOST}${VK_CALLBACK_ROUTE}`,
	});

	/**
	 * Отображает HTML-элемент, в котором будет расположена кнопка авторизации ВКонтакте.
	 */
	return <div ref={ref} id="my-element"></div>;
};

export default observer(AuthVkButton);
