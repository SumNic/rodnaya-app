import React from 'react';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { API_URL, PERSONALE_ROUTE } from '../utils/consts';
import { User } from '../services/UserService';
import { parseIsUrlProtocol } from '../utils/function';

interface FoundersListProps {
	founders: User[];
}

const FoundersList: React.FC<FoundersListProps> = ({ founders }) => {
	return (
		<>
			{founders.map((user: User) => (
				<li key={user.id} style={{ display: 'flex', flexDirection: 'column' }}>
					<div className="mes__wrapper_founders">
						<Link to={PERSONALE_ROUTE + `/${user.id}`}>
							<Avatar
								className="mes_foto"
								src={
									user.photo_max && parseIsUrlProtocol(user.photo_max)
										? user.photo_max
										: `${API_URL}/file/${user.photo_max}`
								}
								size={40}
							/>
						</Link>
						<div className="name__first_last_founders">
							<Link to={PERSONALE_ROUTE + `/${user.id}`} className="name__first">
								<p className="name__first">{user.first_name}</p>
							</Link>
							<Link to={PERSONALE_ROUTE + `/${user.id}`} className="name__first">
								<p className="name__first">{user.last_name}</p>
							</Link>
						</div>
					</div>
				</li>
			))}
		</>
	);
};

export default FoundersList;
