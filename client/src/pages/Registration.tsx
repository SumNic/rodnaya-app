// import { Context } from '..';
import ConditionsForm from '../components/ConditionsForm';
import Footer from '../components/Footer';
import HeaderLogoRegistr from '../components/HeaderLogo/HeaderLogoRegistr';
import OnChangeForm from '../components/OnChangeForm';
import { observer } from 'mobx-react-lite';
import MyButtonInput from '../components/MyButtonInput';
import { useStoreContext } from '../contexts/StoreContext';

function Registration() {

    // const {store} = useContext(Context)
    const { store } = useStoreContext();

    return (
        <div>
            <header className="header">
                < HeaderLogoRegistr />
            </header>

            <div className="middle">
                <div className="middle__wrapper">
                    <div className="main__screen main__screen__registr" style={{backgroundSize: "491.4px 491.4px"}}>
                        <div className="form__registr" style={{textAlign: "justify"}}>

                            {!store.authStore.isRegistrationEnd && store.authStore.isCondition && !store.authStore.isDelProfile && 
                            <>
                                <ConditionsForm />
                                <MyButtonInput type="submit" form="condition" id="submit" value="Продолжить регистрацию" />
                            </>}

                            {!store.authStore.user.residency && store.authStore.isRegistrationEnd && <OnChangeForm id={store.authStore.user.id} secret={store.authStore.user.secret}/>}
                            
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

        </div>
    );
}

export default observer(Registration);