import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '..';
import LogoLoad from '../components/LogoLoad/LogoLoad';
import { PERSONALE_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';

function VkCallback() {

    const {store} = useContext(Context)
    const navigate = useNavigate()

    const queryParams = new URLSearchParams(window.location.search)
    const code: string | null = queryParams.get("payload")

    if (!code) {
        store.setError(true)
    } else {
        const payload = JSON.parse(code)
        registration(payload)
    }
    
    async function registration(payload: {}) {
        const registrVk = await store.registrationVk(payload)
        
        if (registrVk.error) {
            store.setError(true)
            store.setMessageError(registrVk.error?.message)
        }else if (!registrVk.token) {
            store.setIsCondition(true)
            navigate(REGISTRATION_ROUTE)
        } else {
            navigate(PERSONALE_ROUTE)
        }
    }

    return (
        <div>
            <LogoLoad />
        </div>
    );
}

export default VkCallback;