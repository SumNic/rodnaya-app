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
        
        if (registrVk.data.error) {
            store.setError(true)
            store.setMessageError(registrVk.data.error.message)
        }else if (!registrVk.data.isRegistration && registrVk.data.id) {
            store.setIsCondition(true)
            navigate(REGISTRATION_ROUTE, {state: {user: registrVk.data}})
        } else if (registrVk.data.isRegistration && registrVk.data.id){
            await store.loginVk(registrVk.data.id, registrVk.data.secret)
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