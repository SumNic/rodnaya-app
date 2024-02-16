import { Component } from 'react';
import { Link } from 'react-router-dom';
import { EXIT_ROUTE, HOME_ROUTE, MESSAGES_ROUTE, PERSONALE_ROUTE } from '../../utils/consts';
import logo_40x40 from '../../images/svg/Logotip-Rodnoj-parti-40x40.svg'

class NavMiddle extends Component {
    render() {
        return (
			<nav className="middle__menu">

				<input id="menu-toggle" type="checkbox" />
				<label className='menu-button-container' htmlFor="menu-toggle">
					<div className='menu-button'></div>
				</label>

				<ul className="middle__list">
					<li className="middle__item">
						<Link to={HOME_ROUTE} className="middle__link">Главная</Link>
					</li>
					<li className="middle__item">
						<Link to={PERSONALE_ROUTE} className="middle__link">Моя страница</Link>
					</li>
					<li className="middle__item">
						<Link to={MESSAGES_ROUTE} className="middle__link">Сообщения</Link>
					</li>
					<li className="middle__item">
						<Link to={EXIT_ROUTE} className="middle__link">Выйти</Link>
					</li>												
				</ul>

				<div className="logo">
					<Link to={HOME_ROUTE} className="header__logo-link">
						<img src={logo_40x40} alt="Родная партия" className=""></img>
					</Link>
				</div>
			</nav>
			
        );
    }
}

export default NavMiddle;