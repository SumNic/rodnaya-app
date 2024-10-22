// import { Context } from '..';
import Footer from '../components/Footer';
import HeaderLogoRegistr from '../components/HeaderLogo/HeaderLogoRegistr';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';
import MyButton from '../components/MyButton';
import { HOME_ROUTE, PERSONALE_ROUTE } from '../utils/consts';
import { useStoreContext } from '../contexts/StoreContext';

function RestoreUser() {

    // const {store} = useContext(Context)
    const { store } = useStoreContext();
    const navigate = useNavigate()

    const location = useLocation()
    const { user } = location.state

    function restoreProfile() {
        store.restoreProfile(user.id, user.secret)
            .then(() => store.loginVk(user.id, user.secret))
            .then(() => {
                navigate(PERSONALE_ROUTE)
                })
    }

    function delProfile() {
        store.setDelProfile(true)
        navigate(HOME_ROUTE)
    }

    return (
        <div>
            <header className="header">
                < HeaderLogoRegistr />
            </header>

            <div className="middle">
                <div className="middle__wrapper">
                    <div className="main__screen main__screen__registr" style={{backgroundSize: "491.4px 491.4px"}}>
                        <div className="form__registr" style={{textAlign: "justify"}}>
                                <h2 className="My__error_text" style={{fontSize: "17px"}}>
                                    Ваш профиль удалён. Хотите восстановить свой профиль?
                                </h2>
                                <div style={{display: "flex"}}>
                                    <MyButton type="submit" text="Восстановить профиль"  func={restoreProfile} />
                                    <MyButton type="reset" text="Отменить"  style={{background: "#bbbb50"}} func={delProfile} />
                                </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

        </div>
    );
}

export default observer(RestoreUser);