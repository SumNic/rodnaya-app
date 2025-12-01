// PushInit.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pushService } from '../services/PushService';
// import { registerForPush } from './registerForPush';

export const PushInit = () => {
	const navigate = useNavigate();

	useEffect(() => {
		if ((window as any).Capacitor?.isNativePlatform()) {
			const onDeviceReady = async () => {
				// небольшая задержка для стабильности на MIUI / Android 13
				await new Promise((r) => setTimeout(r, 300));
				try {
					await pushService(navigate);
				} catch (e) {
					console.error('Push initialization failed:', e);
				}
			};

			document.addEventListener('deviceready', onDeviceReady);

			// Очистка
			return () => {
				document.removeEventListener('deviceready', onDeviceReady);
			};
		}
	}, [navigate]);

	return null;
};
