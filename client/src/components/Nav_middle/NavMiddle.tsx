import { Component } from 'react';
import { Link } from 'react-router-dom';
import { EXIT_ROUTE, MESSAGES_ROUTE, PERSONALE_ROUTE } from '../../utils/consts';

class NavMiddle extends Component {
    render() {
        return (
            <div>
                <ul className="middle__list">
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
            </div>
        );
    }
}

export default NavMiddle;