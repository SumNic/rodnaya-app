import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { authRoutes, registrationRoutes, errorRoutes, publicRoutes, restoreRoutes, adminRoutes } from '../routes';
import { ERROR_ROUTE, HOME_ROUTE, LOCAL_STORAGE_DEVICE, LOCAL_STORAGE_TOKEN, YANDEX_COUNTER_ID } from '../utils/consts';
import { useStoreContext } from '../contexts/StoreContext';
import LogoLoad from './LogoLoad/LogoLoad';
import WebApp from '@twa-dev/sdk';
import { useYandexPageView } from '../hooks/useYandexPageView';
import { Modal } from 'antd';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

const AppRouter: React.FC = () => {
	const { store } = useStoreContext();
	const { getInfo, commonInfo, isCommonInfoModal, setIsCommonInfoModal } = store.commonStore;
	useYandexPageView(YANDEX_COUNTER_ID);

	const actions: Record<string, () => void> = {
		update_app: async () => {
			await Browser.open({
				url: 'https://storage.yandexcloud.net/new-carpet/app/app-release.apk', // ссылка на приложение
			});
		},
	};

	const updateTgId = async (values: number) => {
		try {
			await store.authStore.updatePersonaleData({
				id: store.authStore.user.id,
				tg_id: values,
			});
		} catch (error) {
			console.error(`Ошибка при обновлении данных пользователя: ${error}`);
		}
	};

	useEffect(() => {
		const tgUserId = WebApp.initDataUnsafe?.user?.id;
		if (tgUserId) {
			localStorage.setItem('tg_id', `${tgUserId}`);
		}
		if (localStorage.getItem(LOCAL_STORAGE_TOKEN) && localStorage.getItem(LOCAL_STORAGE_DEVICE)) {
			store.authStore.checkAuth();
		} else {
			store.authStore.setLoad(false);
		}

		getInfo();
	}, []);

	useEffect(() => {
		const tgId = localStorage.getItem('tg_id');
		if (store.authStore.isAuth && tgId) {
			updateTgId(+tgId);
		}
	}, [store.authStore.isAuth]);

	return store.authStore.load ? (
		<LogoLoad />
	) : (
		<>
			<Routes>
				{store && adminRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
				{store.authStore.isAuth &&
					authRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
				{store.authStore.isCondition &&
					!store.authStore.isDelProfile &&
					registrationRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
				{store.authStore.isDelProfile &&
					restoreRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
				{!store.authStore.isError &&
					publicRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
				{store.authStore.isError &&
					errorRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
				{store.authStore.isError && <Route path="*" element={<Navigate to={ERROR_ROUTE} />} />}
				<Route path="*" element={<Navigate to={HOME_ROUTE} />} />
			</Routes>
			{Capacitor.isNativePlatform() && (
				<Modal
					title="Информация"
					open={isCommonInfoModal}
					onOk={() => {
						const act = actions[commonInfo.action];
						if (act) act();
						setIsCommonInfoModal(false);
					}}
					onCancel={() => {
						setIsCommonInfoModal(false);
					}}
					okText="Да"
					cancelText="Нет"
				>
					<p>{commonInfo.message}</p>
				</Modal>
			)}
		</>
	);
};

export default observer(AppRouter);
