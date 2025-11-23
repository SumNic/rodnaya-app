import { useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { useNavigate } from 'react-router-dom';
import { PluginListenerHandle } from '@capacitor/core';
import { useStoreContext } from '../contexts/StoreContext';

const VkAppUrlHandler = () => {
	const { store } = useStoreContext();
	const navigate = useNavigate();

	useEffect(() => {
		let handler: PluginListenerHandle;

		CapApp.addListener('appUrlOpen', (data) => {
			const url = new URL(data.url);
			if (url.protocol === 'vk54345890:' && url.host === 'vk.ru') {
				const codeFromUrl = url.searchParams.get('payload');
				if (codeFromUrl) {
					const payload = JSON.parse(codeFromUrl);
					store.authStore.registration(payload, navigate);
				} else {
					store.authStore.setError(true);
					store.authStore.setMessageError('Ошибка в VkCallback');
				}
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
