import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthVkButton from '../components/AuthVkButton';
import Footer from '../components/Footer';
import HeaderLogoMobile from '../components/HeaderLogoMobile';
import HeaderLogoPc from '../components/HeaderLogoPc';
import HeaderLogoRegistr from '../components/HeaderLogoRegistr';
import LoginForm from '../components/LoginForm/LoginForm';
import Nav_registr from '../components/Nav_header/Nav_registr';
import Nav from '../components/Nav_header/Nav_registr';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import logo from '../images/svg/logo.svg';

class Auth extends Component {
    render() {
        return (
            <div>
                <header className="header">
                    < HeaderLogoRegistr />
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
                            <div>
                                <h1>Авторизация</h1>
                                <LoginForm />
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

export default Auth;