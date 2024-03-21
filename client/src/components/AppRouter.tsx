import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Context } from '..';
import { authRoutes, registrationRoutes, errorRoutes, publicRoutes, restoreRoutes } from '../routes';
import { ERROR_ROUTE, HOME_ROUTE, PAGE_404_ROUTE } from '../utils/consts';

function AppRouter() {
    const {store} = useContext(Context)
    return (
        <Routes>
            {store.isAuth && authRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            {store.isCondition && !store.isDelProfile && registrationRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            {store.isDelProfile && restoreRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            {!store.isError && publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            {store.isError && errorRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            {store.isError && <Route path='*' element={<Navigate to={ERROR_ROUTE} />} />}
            {store.isAuth && <Route path='*' element={<Navigate to={PAGE_404_ROUTE}/>} />}
            <Route path='*' element={<Navigate to={HOME_ROUTE}/>} />
        </Routes>
    );
}

export default observer(AppRouter);