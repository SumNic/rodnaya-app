import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
    authRoutes,
    registrationRoutes,
    errorRoutes,
    publicRoutes,
    restoreRoutes,
} from "../routes";
import {
    ERROR_ROUTE,
    HOME_ROUTE,
} from "../utils/consts";
import { useStoreContext } from "../contexts/StoreContext";
import LogoLoad from "./LogoLoad/LogoLoad";

/**
 * Главный компонент маршрутизатора приложения.
 * Он обрабатывает маршрутизацию на основе статуса аутентификации пользователя, условий и состояния ошибки.
 * Также он получает и обновляет количество сообщений для каждого местоположения.
 *
 * @returns {JSX.Element} - JSX-элемент для компонента AppRouter.
 */
function AppRouter() {
    const [count, setCount] = useState<number>(0);

    const { store } = useStoreContext();
    
    /**
     * Проверка статуса аутентификации при изменении хранилища.
     *
     * @returns {void}
     */
    useEffect(() => {
        if (localStorage.getItem("token") && localStorage.getItem("device") && !store.isAuth) {
            store.checkAuth();
        } else {
            store.setLoad(false);
        }
    }, []);

    useEffect(() => {
        if (store.isAuth && location) {
            store.getCountMessages()
            store.getEndReadMessagesId()
        }
        setTimeout(() => {          
            setCount(count + 1);
        }, 10000);
    }, [count]);

    // Отрисовка соответствующих маршрутов на основе статуса аутентификации пользователя, условий и состояния ошибки
    return store.load ? <LogoLoad /> : (
        <Routes>
            {store.isAuth &&
                authRoutes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                ))}
            {store.isCondition &&
                !store.isDelProfile &&
                registrationRoutes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                ))}
            {store.isDelProfile &&
                restoreRoutes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                ))}
            {!store.isError &&
                publicRoutes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                ))}
            {store.isError &&
                errorRoutes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                ))}
            {store.isError && (
                <Route path="*" element={<Navigate to={ERROR_ROUTE} />} />
            )}
            <Route path="*" element={<Navigate to={HOME_ROUTE} />} />
        </Routes>
    );
}

export default observer(AppRouter);
