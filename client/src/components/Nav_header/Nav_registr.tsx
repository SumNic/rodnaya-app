import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { EXIT_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE } from '../../utils/consts';

class Nav_registr extends Component {
    render() {
        return (
            <div className="header__menu">
                <ul className="header__list">
					<li className="header__item">
						<Link to={LOGIN_ROUTE} className="header__link">Вход</Link>
					</li>
					<li className="header__item">
						<Link to={REGISTRATION_ROUTE} className="header__link">Регистрация</Link>
					</li>										
				</ul>
            </div>
        );
    }
}

export default Nav_registr;