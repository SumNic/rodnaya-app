import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [react()],
	// build: {
	// 	outDir: './rodnaya-app-mobil/dist',
	// },
	server: {
		port: 3000,
		allowedHosts: mode === 'development' ? true : ['rod-partya.ru'],
	},
}));
