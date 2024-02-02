import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import AuthVkButton from '../components/AuthVkButton';
import Footer from '../components/Footer';
import HeaderLogoRegistr from '../components/HeaderLogoRegistr';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import { REGISTRATION_ROUTE } from '../utils/consts';
import HeaderLogoMobile from '../components/HeaderLogoMobile';

function Auth() {

    return (
        <div>
            <header className="header">
                <div className="header__wrapper">
                    {/* <HeaderLogoPc /> */}
                    <HeaderLogoMobile />
                    <HeaderLogoRegistr />
                </div>
            </header>

            <div className="middle">
                <div className="middle__wrapper">
                    <nav className="middle__menu" style={{visibility: "hidden"}}>
                        <input id="menu-toggle" type="checkbox" />
                        <label className='menu-button-container' htmlFor="menu-toggle">
                            <div className='menu-button'></div>
                        </label>

                        <NavMiddle />

                        <div className="logo">
                            <Link to="/home" className="header__logo-link">
                                <img src="../images/svg/Logotip-Rodnoj-parti-40x40.svg" alt="Родная партия" className=""></img>
                            </Link>
                        </div>
                    </nav>
                    <div className="main__screen main__screen_home">
                        <div id="list_founders">
                            <h2 style={{fontSize: "20px"}}>
                                Регистрация пройдена. Заходи на сайт:
                            </h2>
                            <AuthVkButton />
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

export default observer(Auth);