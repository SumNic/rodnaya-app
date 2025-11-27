import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.rodpartya.app',
	appName: 'Родная партия',
	webDir: 'dist',
	plugins: {
		SplashScreen: {
			androidSplashResourceName: 'splash',
			launchShowDuration: 3000,
			launchAutoHide: true,
			backgroundColor: '#ffffff',
		},
	},
	server: {
		androidScheme: 'http', // Это должна быть та же схема, что указана в OAuth2
		hostname: 'localhost',
	},
};

export default config;
