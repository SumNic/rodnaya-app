import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { authRoutes, registrationRoutes, errorRoutes, publicRoutes, restoreRoutes, adminRoutes } from '../routes';
import { ERROR_ROUTE, HOME_ROUTE, LOCAL_STORAGE_DEVICE, LOCAL_STORAGE_TOKEN } from '../utils/consts';
import { useStoreContext } from '../contexts/StoreContext';
import LogoLoad from './LogoLoad/LogoLoad';

const AppRouter: React.FC = () => {
	const [count, setCount] = useState<number>(0);

	const { store } = useStoreContext();

	/**
	 * Проверка статуса аутентификации при изменении хранилища.
	 *
	 * @returns {void}
	 */
	useEffect(() => {
		if (localStorage.getItem(LOCAL_STORAGE_TOKEN) && localStorage.getItem(LOCAL_STORAGE_DEVICE) && !store.isAuth) {
			store.checkAuth();
		} else {
			localStorage.removeItem(LOCAL_STORAGE_TOKEN)
			localStorage.removeItem(LOCAL_STORAGE_DEVICE)
			store.setLoad(false);
		}
	}, []);

	useEffect(() => {
		if (store.isAuth && location) {
			store.getCountMessages();
			store.getEndReadMessagesId();
		}
		setTimeout(() => {
			setCount((prev) => prev + 1);
		}, 10000);
	}, [count]);

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
