import { useContext } from 'react';
import { Context } from '..';
import ConditionsForm from '../components/ConditionsForm';
import Footer from '../components/Footer';
import HeaderLogoRegistr from '../components/HeaderLogoRegistr';
import MyButtonNext from '../components/MyButtonInput';
import OnChangeForm from '../components/OnChangeForm';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';

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

                                {!store.isRegistrationEnd && store.isCondition && <><ConditionsForm /><MyButtonNext /></>}

                                {store.isRegistrationEnd && <OnChangeForm id={user.id} secret={user.secret}/>}
                                
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />

            </div>
        );
}

export default observer(Registration);