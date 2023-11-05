import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import HeaderLogoMobile from '../components/HeaderLogoMobile';
import HeaderLogoPc from '../components/HeaderLogoPc';
import Nav_registr from '../components/Nav_header/Nav_registr';
import NavMiddle from '../components/Nav_middle/NavMiddle';

class Home extends Component {
    render() {
        return (
            <div>
                <header className="header">
                    <div className="header__wrapper">
                        <HeaderLogoPc />
                        <HeaderLogoMobile />
                        <Nav_registr />
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
                                <h1 style={{fontSize: "30px"}}>Сайт Родная партия</h1>
                                <h2 style={{fontSize: "20px"}}>
                                    Сайт создан для объединения учредителей Родной партии, которые учредили ее как дедушка Анастасии.			
                                </h2>
                                <h2 style={{fontSize: "20px"}}>
                                    Данная Родная партия не нуждается в официальной регистрации.
                                </h2>
                                <h2 style={{fontSize: "20px"}}>
                                    Если вы также считаете себя учредителем своей Родной партии, то можете присоединиться к данному проекту для совместной реализации цели партии. 
                                    Для этого необходимо пройти несложную регистацию.
                                </h2>
                                <Link to="/founders" className="list_founders">Список учредителей своей Родной партии</Link><br></br>
                                <Link to="https://vk.com/club166722362" className="list_founders">Официальная группа ВК</Link>
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
}

export default Home;