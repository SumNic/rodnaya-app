import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Context } from "..";
import {
    authRoutes,
    registrationRoutes,
    errorRoutes,
    publicRoutes,
    restoreRoutes,
} from "../routes";
import {
    ERROR_ROUTE,
    FILES_ROUTE,
    HOME_ROUTE,
    PAGE_404_ROUTE,
} from "../utils/consts";
import MessagesService from "../services/MessagesService";

function AppRouter() {
    const [count, setCount] = useState<number>(0);

    const { store } = useContext(Context);

    useEffect(() => {
        if (store.isAuth) {
            const arrResidencyUser: string[] = ["Земля"];
            for (const [key, val] of Object.entries(store.user.residency)) {
                if (
                    key === "locality" ||
                    key === "region" ||
                    key === "country"
                ) {
                    arrResidencyUser.push(val);
                }
            }

            const getCountMessages = async () => {
                for (const location of arrResidencyUser.reverse()) {
                    const dataPlus = await MessagesService.getCountMessages(
                        store.user.id,
                        store.user.secret.secret,
                        location
                    );
                    store.setArrCountMessages(location, dataPlus.data);
                }
            };

            getCountMessages();

            setTimeout(() => {
                setCount(count + 1);
            }, 5000);
        }
    }, [count]);

    

    return (
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
            {store.isError && (
                <Route path="*" element={<Navigate to={ERROR_ROUTE} />} />
            )}
            {/* {store.isAuth && <Route path={`${FILES_ROUTE}/:namefile`} element={<Navigate to={`${FILES_ROUTE}/${store.nameFile}`}/>} />} */}
            <Route path="*" element={<Navigate to={HOME_ROUTE} />} />
        </Routes>
    );
}

export default observer(AppRouter);
