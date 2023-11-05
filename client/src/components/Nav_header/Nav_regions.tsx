import { Component } from 'react';
import { Link } from 'react-router-dom';
import { COUNTRY_ROUTE, LOCALITY_ROUTE, REGION_ROUTE, WORLD_ROUTE } from '../../utils/consts';

class Nav_regions extends Component {
    render() {
        return (
            <div>
                <ul className="middle__list">
				<li className="middle__item">
						<Link to={LOCALITY_ROUTE} className="middle__link">Район</Link>
					</li>
					<li className="middle__item">
						<Link to={REGION_ROUTE} className="middle__link">Регион</Link>
					</li>
					<li className="middle__item">
						<Link to={COUNTRY_ROUTE} className="middle__link">Страна</Link>
					</li>
					<li className="middle__item">
						<Link to={WORLD_ROUTE} className="middle__link">Мир</Link>
					</li>											
				</ul>
            </div>
        );
    }
}

export default Nav_regions;