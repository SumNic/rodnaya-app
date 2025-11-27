import { useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { useNavigate } from 'react-router-dom';
import { PluginListenerHandle } from '@capacitor/core';
import { useStoreContext } from '../contexts/StoreContext';
import { Browser } from '@capacitor/browser';

const VkAppUrlHandler = () => {
	const { store } = useStoreContext();
	const navigate = useNavigate();

	useEffect(() => {
		let handler: PluginListenerHandle;

		CapApp.addListener('appUrlOpen', (data) => {
			const url = new URL(data.url);
			if (url.protocol === 'vk54345890:' && url.host === 'vk.ru') {
				const device_id = url.searchParams.get('device_id');
				const code = url.searchParams.get('code');
				const stateFromUrl = url.searchParams.get('state');

				const storedState = localStorage.getItem('vk_auth_state');
				const codeVerifier = localStorage.getItem('vk_pkce_code_verifier');

				// сразу очищаем, чтобы не валялось
				localStorage.removeItem('vk_auth_state');
				localStorage.removeItem('vk_pkce_code_verifier');

				if (!device_id || !code) {
					store.authStore.setError(true);
					store.authStore.setMessageError('Ошибка в VkCallback: нет device_id или code');
					return;
				}

				if (!stateFromUrl || !storedState || stateFromUrl !== storedState) {
					console.log(stateFromUrl, storedState, 'stateFromUrl, storedState');

					store.authStore.setError(true);
					store.authStore.setMessageError('Ошибка в VkCallback: несовпадение state');
					return;
				}

				if (!codeVerifier) {
					store.authStore.setError(true);
					store.authStore.setMessageError('Ошибка в VkCallback: отсутствует code_verifier');
					return;
				}

				const payload = {
					device_id,
					code,
					code_verifier: codeVerifier,
				};

				console.log(device_id, code, codeVerifier, 'device_id code codeVerifier');

				// дальше ваш метод регистрации/логина:
				store.authStore.androidRegistration(payload, navigate);
			} else {
				Browser.open({ url: data.url });
			}
		}).then((h) => {
			handler = h;
		});

		return () => {
			handler?.remove(); // теперь TS знает, что remove существует
		};
	}, [store, navigate]);

	return null;
};

export default VkAppUrlHandler;
