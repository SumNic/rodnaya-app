import { Component } from 'react';
import { Link } from 'react-router-dom';
import { COUNTRY_ROUTE, LOCALITY_ROUTE, REGION_ROUTE, WORLD_ROUTE } from '../../utils/consts';

class NavRegions extends Component {
    render() {
        return (
			<nav className="header__menu">
                <ul className="header__list">
					<li className="header__item">
						<Link to={LOCALITY_ROUTE} className="header__link">Район</Link>
					</li>
					<li className="header__item">
						<Link to={REGION_ROUTE} className="header__link">Регион</Link>
					</li>
					<li className="header__item">
						<Link to={COUNTRY_ROUTE} className="header__link">Страна</Link>
					</li>
					<li className="header__item">
						<Link to={WORLD_ROUTE} className="header__link">Мир</Link>
					</li>											
				</ul>
            </nav>
        );
    }
}

export default NavRegions;