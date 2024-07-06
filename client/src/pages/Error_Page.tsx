import { Link, useNavigate } from 'react-router-dom';
// import { Context } from '..';
import Footer from '../components/Footer';
import HeaderLogoMobile from '../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../components/HeaderLogo/HeaderLogoRegistr';
import MyButton from '../components/MyButton';
import { HOME_ROUTE } from '../utils/consts';
import { useStoreContext } from '../contexts/StoreContext';

function Error_Page() {

    const navigate = useNavigate()
    // const {store} = useContext(Context)
    const { store } = useStoreContext();

    function returnHome() {
        if(store.isMessageError === 'Доступ запрещен') {
            localStorage.removeItem('token')
            localStorage.removeItem('device')
        }
        store.setError(false)
        navigate(HOME_ROUTE)
    }

    return (
        <div>
            <header className="header">
                <div className="header__wrapper">
                    <HeaderLogoMobile />
                    <HeaderLogoRegistr />
                </div>
            </header>

            <div className="middle">
                <div className="middle__wrapper">
                    <nav className="middle__menu">
                        <input id="menu-toggle" type="checkbox" />
                        <label className='menu-button-container' htmlFor="menu-toggle">
                            <div className='menu-button'></div>
                        </label>

                        <div className="logo">
                            <Link to="/home" className="header__logo-link">
                                <img src="../images/svg/Logotip-Rodnoj-parti-40x40.svg" alt="Родная партия" className=""></img>
                            </Link>
                        </div>
                    </nav>
                    <div className="main__screen main__screen_home">
                        <div id="list_founders">
                            <h2 className="My__error_text" style={{fontSize: "20px"}}>
                                Ошибка:			
                            </h2>
                            <h2 className="My__error_text" style={{fontSize: "17px"}}>
                                {store.isMessageError ? store.isMessageError : "Произошла неизвестная ошибка"}		
                            </h2>
                            <MyButton text={"Вернуться на главную"} func={returnHome} />
                        </div>

                        <div className="main__screen-flag">
                        
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

        </div>
    );
}

export default Error_Page;