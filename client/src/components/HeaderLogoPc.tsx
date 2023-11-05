import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/svg/logo.svg';

class HeaderLogoPc extends Component {
    render() {
        return (
            <div className="header__logo-pc">
                <Link to="/home" className="header__logo-link">
                    <img src={logo} alt="Родная партия" className="header__logo-pic"></img>
                </Link>
            </div>
        );
    }
}

export default HeaderLogoPc;