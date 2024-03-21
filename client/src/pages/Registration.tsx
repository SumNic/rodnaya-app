import { useContext } from 'react';
import { Context } from '..';
import ConditionsForm from '../components/ConditionsForm';
import Footer from '../components/Footer';
import HeaderLogoRegistr from '../components/HeaderLogoRegistr';
import OnChangeForm from '../components/OnChangeForm';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';
import MyButtonInput from '../components/MyButtonInput';
import MyButton from '../components/MyButton';
import { HOME_ROUTE, PERSONALE_ROUTE } from '../utils/consts';

function Registration() {

    const {store} = useContext(Context)
    const navigate = useNavigate()

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

                            {!store.isRegistrationEnd && store.isCondition && !store.isDelProfile && 
                            <>
                                <ConditionsForm />
                                <MyButtonInput type="submit" form="condition" id="submit" value="Продолжить регистрацию" />
                            </>}

                            {!store.user.residency && store.isRegistrationEnd && <OnChangeForm id={user.id} secret={user.secret.secret}/>}
                            
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

        </div>
    );
}

export default observer(Registration);