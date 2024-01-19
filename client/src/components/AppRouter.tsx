import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Context } from '..';
import { authRoutes, conditionRoutes, errorRoutes, publicRoutes } from '../routes';
import { ERROR_ROUTE, HOME_ROUTE } from '../utils/consts';

function AppRouter() {
    const {store} = useContext(Context)
    console.log(store.isError)
    return (
        <Routes>
            {store.isAuth === true && authRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            {store.isCondition === true && conditionRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            {!store.isError && publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            {store.isError && errorRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            {store.isError && <Route path='*' element={<Navigate to={`${ERROR_ROUTE}?message=${store.isMessageError}`} />} />}
            <Route path='*' element={<Navigate to={HOME_ROUTE}/>} />
        </Routes>
    );
}

export default observer(AppRouter);