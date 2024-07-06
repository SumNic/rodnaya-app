import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { Context } from "..";
import LogoLoad from "../components/LogoLoad/LogoLoad";
import {
    PERSONALE_ROUTE,
    REGISTRATION_ROUTE,
    RESTORE_PROFILE_ROUTE,
} from "../utils/consts";
import { useStoreContext } from "../contexts/StoreContext";

function VkCallback() {
    const { store } = useStoreContext();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(window.location.search);
    const code: string | null = queryParams.get("payload");

    useEffect(() => {
        if (!code) {
            store.setError(true);
            return
        } 
        const payload = JSON.parse(code);
        registration(payload);
    }, [])

    async function registration(payload: {}) {
        const registrVk = await store.registrationVk(payload);

        if (!registrVk) return;
        if (registrVk.data.isDelProfile) {
            store.setDelProfile(true);
            navigate(RESTORE_PROFILE_ROUTE, {
                state: { user: registrVk.data },
            });
        } else if (!registrVk.data.isRegistration && registrVk.data.id) {
            store.setIsCondition(true);
            store.setUser(registrVk.data);
            navigate(REGISTRATION_ROUTE);
            // navigate(REGISTRATION_ROUTE, {state: {user: registrVk.data}})
        } else if (registrVk.data.isRegistration && registrVk.data.id) {
            await store.loginVk(
                registrVk.data.id,
                registrVk.data.secret.secret
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
