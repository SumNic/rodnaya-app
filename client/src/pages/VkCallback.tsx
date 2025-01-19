import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogoLoad from "../components/LogoLoad/LogoLoad";
import {
    BLOCKED_ROUTE,
    PERSONALE_ROUTE,
    REGISTRATION_ROUTE,
    RESTORE_PROFILE_ROUTE,
} from "../utils/consts";
import { useStoreContext } from "../contexts/StoreContext";

const VkCallback: React.FC = () => {
    const { store } = useStoreContext();
    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const codeFromUrl = queryParams.get("payload");
        if (codeFromUrl) {
            const payload = JSON.parse(codeFromUrl);
            registration(payload);
        } else {
            store.setError(true);
            store.setMessageError('Ошибка в VkCallback');
        }
    }, []);

    async function registration(payload: {}) {
        const registrVk = await store.registrationVk(payload);
        if (!registrVk?.data) return;
        if (registrVk.data.isDelProfile) {
            store.setDelProfile(true);
            navigate(RESTORE_PROFILE_ROUTE, {
                state: { user: registrVk.data },
            });
        } else if (!registrVk.data.isRegistration && registrVk.data.blockedforever) {
            return navigate(BLOCKED_ROUTE)
        } else if (!registrVk.data.isRegistration && registrVk.data.id) {
            store.setIsCondition(true);
            store.setUser(registrVk.data);
            navigate(REGISTRATION_ROUTE);
        } else if (registrVk.data.isRegistration && registrVk.data.id) {
            await store.loginVk(
                registrVk.data.id,
                registrVk.data.secret
            );
            navigate(PERSONALE_ROUTE);
        }
    }

    return (
        <div>
            <LogoLoad />
        </div>
    );
}

export default VkCallback;
