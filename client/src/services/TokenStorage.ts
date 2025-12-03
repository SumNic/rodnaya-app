import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

let cachedRefreshToken: string | null = null;

export const TokenStorage = {
	async getRefresh() {
		if (cachedRefreshToken !== null) return cachedRefreshToken;

		if (Capacitor.isNativePlatform()) {
			const { value } = await Preferences.get({ key: 'refresh_token' });
			cachedRefreshToken = value;
			return value;
		}
		return null;
	},

	async setRefresh(token: string) {
		if (Capacitor.isNativePlatform()) {
			if (cachedRefreshToken !== token) {
				await Preferences.set({ key: 'refresh_token', value: token });
				cachedRefreshToken = token;
			}
		}
	},

	async removeRefresh() {
		if (Capacitor.isNativePlatform()) {
			await Preferences.remove({ key: 'refresh_token' });
			cachedRefreshToken = null;
		}
	},
};
