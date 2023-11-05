import { observer } from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import { Context } from '../..';
import './LoginForm.css';

function LoginForm() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {store} = useContext(Context)
    return (
        <div className="block_login_form">
            <input 
                className="input_login_form"
                onChange={e => setEmail(e.target.value)}
                value={email}
                type="text" 
                placeholder='Email'
            />
            <input 
                className="input_login_form"
                onChange={e => setPassword(e.target.value)}
                value={password}
                type="text" 
                placeholder='Password'
            />
            <button className="button_login" onClick={() => store.login(email, password)}>
                Вход
            </button>
            <button className="button_login" onClick={() => store.registration(email, password)}>
                Регистрация
            </button>
        </div>
    );
}

export default observer(LoginForm);