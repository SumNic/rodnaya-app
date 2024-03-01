import { Component } from 'react';
import { Link } from 'react-router-dom';
import { MESSAGES_ROUTE } from '../../utils/consts';
// import { COUNTRY_ROUTE, LOCALITY_ROUTE, REGION_ROUTE, WORLD_ROUTE } from '../../utils/consts';

class NavRegions extends Component {
    render() {
        return (
			<nav className="header__menu">
                <ul className="header__list">
					<li className="header__item">
						<Link to={`${MESSAGES_ROUTE}/locality`} className="header__link">Район</Link>
					</li>
					<li className="header__item">
						<Link to={`${MESSAGES_ROUTE}/region`} className="header__link">Регион</Link>
					</li>
					<li className="header__item">
						<Link to={`${MESSAGES_ROUTE}/country`} className="header__link">Страна</Link>
					</li>
					<li className="header__item">
						<Link to={`${MESSAGES_ROUTE}/world`} className="header__link">Мир</Link>
					</li>											
				</ul>
            </nav>
        );
    }
}

export default NavRegions;