import { observer } from 'mobx-react-lite';
import React, { Component, useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Context } from '..';
import { authRoutes, conditionRoutes, publicRoutes } from '../routes';
import { HOME_ROUTE, NEXT_REGISTR_STEP_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';

function AppRouter() {
    const {store} = useContext(Context)
    return (
        <Routes>
            {store.isAuth === true && authRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            {store.isCondition === true && conditionRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            {publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} />
            )}
            <Route path='*' element={<Navigate to={HOME_ROUTE}/>} />
        </Routes>
    );
}

export default observer(AppRouter);