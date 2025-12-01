import { PushNotifications } from '@capacitor/push-notifications';
import store from '../store';
import { Device } from '@capacitor/device';
import { useNavigate } from 'react-router-dom';

let listenersAttached = false;
let initializationAttempted = false;

export async function pushService(navigate: ReturnType<typeof useNavigate>) {
	// Защита от повторных вызовов
	if (initializationAttempted) {
		return;
	}
	initializationAttempted = true;

	const { addFcmDeviceToken } = store.authStore;

	try {
		await new Promise((r) => setTimeout(r, 200));

		const info = await Device.getId();
		const deviceId = info.identifier;

		// Проверка разрешений
		let perm;
		try {
			perm = await PushNotifications.checkPermissions();
		} catch (error) {
			console.warn('Check permissions failed, requesting directly...', error);
			perm = await PushNotifications.requestPermissions();
		}

		if (perm.receive === 'prompt') {
			perm = await PushNotifications.requestPermissions();
		}

		if (perm.receive !== 'granted') {
			console.warn('Push permission not granted');
			return;
		}

		// Регистрируем слушатели только один раз
		if (!listenersAttached) {
			listenersAttached = true;

			// Регистрация токена
			PushNotifications.addListener('registration', async (token) => {
				console.log('DEVICE FCM TOKEN:', token.value);
				try {
					await addFcmDeviceToken({ token: token.value, platform: 'android', deviceId });
				} catch (error) {
					console.error('Failed to save FCM token:', error);
				}
			});

			PushNotifications.addListener('registrationError', (error) => {
				console.error('Push registration failed:', error);
			});

			// Уведомление получено
			PushNotifications.addListener('pushNotificationReceived', (notification) => {
				console.log('Notification received:', notification);
			});

			// Пользователь тапнул на уведомление
			PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
				console.log('Notification action performed:', notification);
				const data = notification.notification.data;
				if (data?.route) {
					navigate(data.route);
				}
			});
		}

		// Регистрируем push-уведомления
		await PushNotifications.register();
		console.log('Push notifications registered successfully');
	} catch (error) {
		console.warn('Permissions check failed, retrying...', error);
		initializationAttempted = false; // Разрешаем повторную попытку
	}
}
