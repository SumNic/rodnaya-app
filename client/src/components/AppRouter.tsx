import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { authRoutes, registrationRoutes, errorRoutes, publicRoutes, restoreRoutes, adminRoutes } from '../routes';
import { ERROR_ROUTE, HOME_ROUTE, LOCAL_STORAGE_DEVICE, LOCAL_STORAGE_TOKEN } from '../utils/consts';
import { useStoreContext } from '../contexts/StoreContext';
import LogoLoad from './LogoLoad/LogoLoad';

const AppRouter: React.FC = () => {
	const { store } = useStoreContext();

	useEffect(() => {
		if (localStorage.getItem(LOCAL_STORAGE_TOKEN) && localStorage.getItem(LOCAL_STORAGE_DEVICE)) {
			store.authStore.checkAuth();
		} else {
			localStorage.removeItem(LOCAL_STORAGE_TOKEN)
			localStorage.removeItem(LOCAL_STORAGE_DEVICE)
			store.authStore.setLoad(false);
		}
	}, []);

	return store.authStore.load ? (
		<LogoLoad />
	) : (
		<Routes>
            {store &&
				adminRoutes.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
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
	);
}

export default observer(AppRouter);
