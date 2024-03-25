import { Component, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthVkButton from '../components/AuthVkButton';
import Footer from '../components/Footer';
import HeaderLogoMobile from '../components/HeaderLogoMobile';
import HeaderLogoRegistr from '../components/HeaderLogoRegistr';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { FOUNDERS_ROUTE } from '../utils/consts';

function Home () {

    const {store} = useContext(Context)
    
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
                    {store.isAuth && <NavMiddle />}
                    {!store.isAuth && <nav className="middle__menu"></nav>}
                    <div className="main__screen main__screen_home">
                        <div id="list_founders">
                            <h1 style={{fontSize: "30px"}}>Сайт Родная партия</h1>
                            <h2 style={{fontSize: "20px"}}>
                                Сайт создан для объединения учредителей Родной партии, которые учредили ее как дедушка Анастасии.			
                            </h2>
                            <h2 style={{fontSize: "20px"}}>
                                Данная Родная партия не нуждается в официальной регистрации.
                            </h2>
                            <h2 style={{fontSize: "20px"}}>
                                Если ты считаешь себя учредителем своей Родной партии, то присоединяйся.
                            </h2>
                            {!store.isAuth && <AuthVkButton />}
                            <h2 style={{fontSize: "20px"}}>
                                <Link to={FOUNDERS_ROUTE} className="list_founders">Список учредителей своей Родной партии</Link>
                            </h2>
                            <h2 style={{fontSize: "20px"}}>
                                <Link to="https://vk.com/club166722362" className="list_founders">Группа ВК</Link>
                            </h2>
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

export default observer(Home);