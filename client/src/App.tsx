import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import { useTheme } from './hooks/useTheme.hook';
import { ThemeContext } from './contexts/ThemeContext';
import { useStore } from './hooks/useStore.hook';
import { StoreContext } from './contexts/StoreContext';
import { SocketContext } from './contexts/SocketContext';
import { observer } from 'mobx-react-lite';
import { useMessage } from './hooks/useMessage.hook.ts';
import { MessageContext } from './contexts/MessageContext.ts';
import { ConfigProvider } from 'antd';
import { useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { YANDEX_COUNTER_ID } from './utils/consts.tsx';
import { YandexMetrika } from './components/YandexMetrika.tsx';
import VkAppUrlHandler from './components/VkAppUrlHandler.tsx';
import { PushInit } from './components/PushInit.tsx';
import { useSocket } from './hooks/useSocket.hook.ts';
import { useGroup } from './hooks/useGroup.hook.ts';
import { GroupContext } from './contexts/GroupContext.ts';

function App() {
	const rodnayaTheme = useTheme();
	const storeState = useStore();

	const { user } = storeState.store.authStore;
	const { vechStore } = storeState.store;
	const isSocketReady = !!user?.id && !!user?.residency && Array.isArray(user?.userGroups);

	const socketObj = useSocket(
		isSocketReady
			? {
					userId: user.id,
					groupIds: user.userGroups.map((g) => g.id),
					residency: user.residency,
				}
			: null
	);
	const { socket } = socketObj;

	const message = useMessage(socket);
	const group = useGroup(socket);

	useEffect(() => {
		WebApp.ready(); // важно — сообщает Telegram, что Mini App загрузилась
		WebApp.expand(); // разворачивает Mini App на весь экран
		WebApp.disableVerticalSwipes(); // запрещает свайпы вверх и вниз
	}, []);

	useEffect(() => {
		if (!socket) return;

		vechStore.bindSocket(socket);

		return () => {
			socket.off('newVech');
		};
	}, [socketObj]);

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
					<GroupContext.Provider value={group}>
						<StoreContext.Provider value={storeState}>
							<SocketContext.Provider value={socketObj}>
								<ThemeContext.Provider value={rodnayaTheme}>
									<VkAppUrlHandler />
									<PushInit />
									<YandexMetrika counterId={YANDEX_COUNTER_ID} />
									<AppRouter />
								</ThemeContext.Provider>
							</SocketContext.Provider>
						</StoreContext.Provider>
					</GroupContext.Provider>
				</MessageContext.Provider>
			</ConfigProvider>
		</BrowserRouter>
	);
}

export default observer(App);
