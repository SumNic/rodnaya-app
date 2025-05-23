import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import { useTheme } from './hooks/useTheme.hook';
import { ThemeContext } from './contexts/ThemeContext';
import { useStore } from './hooks/useStore.hook';
import { StoreContext } from './contexts/StoreContext';
import { observer } from 'mobx-react-lite';
import { useMessage } from './hooks/useMessage.hook.ts';
import { MessageContext } from './contexts/MessageContext.ts';
import { ConfigProvider } from 'antd';

function App() {
	const rodnayaTheme = useTheme();
	const storeState = useStore();
	const message = useMessage();

	return (
		<BrowserRouter>
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: '#167859', // Ваш основной цвет
						fontSize: 16,
					},
				}}
			>
				<MessageContext.Provider value={message}>
					<StoreContext.Provider value={storeState}>
						<ThemeContext.Provider value={rodnayaTheme}>
							<AppRouter />
						</ThemeContext.Provider>
					</StoreContext.Provider>
				</MessageContext.Provider>
			</ConfigProvider>
		</BrowserRouter>
	);
}

export default observer(App);
