import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { authRoutes, registrationRoutes, errorRoutes, publicRoutes, restoreRoutes, adminRoutes } from '../routes';
import { ERROR_ROUTE, HOME_ROUTE, LOCAL_STORAGE_DEVICE, LOCAL_STORAGE_TOKEN } from '../utils/consts';
import { useStoreContext } from '../contexts/StoreContext';
import LogoLoad from './LogoLoad/LogoLoad';
import { useConnectSocket } from '../hooks/useConnectSocket';

const AppRouter: React.FC = () => {
	const { store } = useStoreContext();

	useEffect(() => {
		if (localStorage.getItem(LOCAL_STORAGE_TOKEN) && localStorage.getItem(LOCAL_STORAGE_DEVICE) && !store.isAuth) {
			store.checkAuth();
		} else {
			localStorage.removeItem(LOCAL_STORAGE_TOKEN)
			localStorage.removeItem(LOCAL_STORAGE_DEVICE)
			store.setLoad(false);
		}
	}, []);

	useConnectSocket()

	useEffect(() => {
		if (store.isAuth && location) {
			store.getCountMessages();
			store.getEndReadMessagesId();
			
		}
	}, [store.isAuth, location]);

	// Отрисовка соответствующих маршрутов на основе статуса аутентификации пользователя, условий и состояния ошибки
	return store.load ? (
		<LogoLoad />
	) : (
		<Routes>
            {store &&
				adminRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
			{store.isAuth &&
				authRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
			{store.isCondition &&
				!store.isDelProfile &&
				registrationRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
			{store.isDelProfile &&
				restoreRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
			{!store.isError &&
				publicRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
			{store.isError &&
				errorRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
			{store.isError && <Route path="*" element={<Navigate to={ERROR_ROUTE} />} />}
			<Route path="*" element={<Navigate to={HOME_ROUTE} />} />
		</Routes>
	);
}

export default observer(AppRouter);
