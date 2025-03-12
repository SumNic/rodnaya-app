import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import HeaderLogoMobile from '../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../components/HeaderLogo/HeaderLogoRegistr';
import { HOME_ROUTE, LOCAL_STORAGE_DEVICE, LOCAL_STORAGE_TOKEN } from '../utils/consts';
import { useStoreContext } from '../contexts/StoreContext';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import { Button } from 'antd';
import React from 'react';
import { useThemeContext } from '../contexts/ThemeContext';

const Error_Page: React.FC = () => {

    const navigate = useNavigate()
    const { store } = useStoreContext();
    const { currentWidth } = useThemeContext();

    function returnHome() {
        if(store.authStore.isMessageError === 'Доступ запрещен') {
            localStorage.removeItem(LOCAL_STORAGE_TOKEN)
            localStorage.removeItem(LOCAL_STORAGE_DEVICE)
        }
        store.authStore.setError(false)
        navigate(HOME_ROUTE)
    }

    return (
        <div>
            <header className="header">
                <div className="header__wrapper">
                    {currentWidth && currentWidth < 830 && <NavMiddle item={HOME_ROUTE} />}
                    <HeaderLogoMobile />
                    <HeaderLogoRegistr />
                </div>
            </header>

            <div className="middle">
                <div className="middle__wrapper">
                    {currentWidth && currentWidth >= 830 && <NavMiddle item={HOME_ROUTE} />}
                    <div className="main__screen main__screen_home">
                        <div id="list_founders"  className="founders-section">
                            <h2 className="My__error_text" style={{fontSize: "20px"}}>
                                Ошибка:			
                            </h2>
                            <h2 className="My__error_text" style={{fontSize: "17px"}}>
                                {store.authStore.isMessageError ? store.authStore.isMessageError : "Произошла неизвестная ошибка"}		
                            </h2>
                            <Button type='primary' onClick={returnHome}>Вернуться на главную</Button>
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