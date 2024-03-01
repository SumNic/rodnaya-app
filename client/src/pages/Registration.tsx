import { useContext } from 'react';
import { Context } from '..';
import ConditionsForm from '../components/ConditionsForm';
import Footer from '../components/Footer';
import HeaderLogoRegistr from '../components/HeaderLogoRegistr';
import OnChangeForm from '../components/OnChangeForm';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import MyButtonInput from '../components/MyButtonInput';

function Registration() {

    const {store} = useContext(Context)

    const location = useLocation()
    const { user } = location.state

        return (
            <div>
                <header className="header">
                    < HeaderLogoRegistr />
                </header>

                <div className="middle">
                    <div className="middle__wrapper">
                        <div className="main__screen main__screen__registr" style={{backgroundSize: "491.4px 491.4px"}}>
                            <div className="form__registr" style={{textAlign: "justify"}}>

                                {!store.isRegistrationEnd && store.isCondition && 
                                <>
                                    <ConditionsForm />
                                    <MyButtonInput type="submit" form="condition" id="submit" value="Продолжить регистрацию" />
                                </>}

                                {store.isRegistrationEnd && <OnChangeForm id={user.id} secret={user.secret.secret}/>}
                                
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />

            </div>
        );
}

export default observer(Registration);