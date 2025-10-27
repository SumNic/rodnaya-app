import React from 'react';
import { IUser } from '../models/IUser';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { PERSONALE_ROUTE } from '../utils/consts';

interface FoundersListProps {
	founders: IUser[];
}

const FoundersList: React.FC<FoundersListProps> = ({ founders }) => {
	return (
		<>
			{founders.map((user: IUser) => (
				<li key={user.id} style={{ display: 'flex', flexDirection: 'column' }}>
					<div className="mes__wrapper_founders">
						<Link to={PERSONALE_ROUTE + `/${user.id}`}>
							<Avatar className="mes_foto" src={user.photo_50} size={40} />
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
