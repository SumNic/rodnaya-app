import { Component } from 'react';

class NavHeaderLoad extends Component {
    render() {
        return (
            <div className="header__menu">
                <ul className="header__list">
					<li className="header__item">
						{/* <Link to={LOGIN_ROUTE} className="header__link">Вход</Link> */}
					</li>
					<li className="header__item">
						{/* <Link to={REGISTRATION_ROUTE} className="header__link">Регистрация</Link> */}
					</li>
				</ul>
            </div>
        );
    }
}

export default NavHeaderLoad;