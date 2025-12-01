import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

export const TokenStorage = {
	async getRefresh() {
		if (Capacitor.isNativePlatform()) {
			const { value } = await Preferences.get({ key: 'refresh_token' });
			return value;
		}
		return null; // В вебе refresh хранится в HttpOnly cookie, сервер сам его читает
	},

	async setRefresh(token: string) {
		if (Capacitor.isNativePlatform()) {
			const current = await Preferences.get({ key: 'refresh_token' });

			if (current.value !== token) {
				await Preferences.set({ key: 'refresh_token', value: token });
			}
		}
	},

	async removeRefresh() {
		if (Capacitor.isNativePlatform()) {
			await Preferences.remove({ key: 'refresh_token' });
		}
	},
};
