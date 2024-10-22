import { observer } from 'mobx-react-lite';
import Footer from '../components/Footer';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../components/HeaderLogo/HeaderLogoRegistr';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IUser } from '../models/IUser';
import UserService from '../services/UserService';

const Personale_kard: React.FC = () => {
	const [user, setuser] = useState<IUser>();

	const { id } = useParams();

	useEffect(() => {
		getuser();
	}, [id]);

	const getuser = async () => {
		try {
			if (id) {
				const user = await UserService.getUser(+id);
				if (user.data) setuser(user.data);
			}
		} catch (error) {
			console.log(`Ошибка в getuser? Personale_kard: ${error}`);
		}
	};

	// const [edit, setEdit] = useState<boolean>(false)
	// const [editPersonale, setEditPersonale] = useState<boolean>(false)
	// const [editResidency, setEditResidency] = useState<boolean>(false)
	// const [editDeclaration, setEditDeclaration] = useState<boolean>(false)
	// const [editProfile, setEditProfile] = useState<boolean>(false)

	// useEffect(() => {
	//     if (cancelAction) {
	//         setEdit(false)
	//         setEditPersonale(false)
	//         setEditResidency(false)
	//         setEditDeclaration(false)
	//         setEditProfile(false)
	//     }
	//     setCancelAction(false)
	// })

	const personaleData = (
		<>
			<h2 style={{ fontSize: '20px' }}>Учредитель Родной партии:</h2>
			<div className="photo_big__wrapper">
				<img className="photo_big" src={user?.photo_max} alt="Ваше фото"></img>
				<div className="personale_p__wrapper" style={{ paddingBottom: 0 }}>
					<h2 style={{ fontSize: '18px' }}>Персональные данные:</h2>
					<p className="personale_data">Имя: {user?.first_name}</p>
					<p className="personale_data">Фамилия: {user?.last_name}</p>
					<p className="personale_data">
						<a href={`https://vk.com/id${user?.vk_id}`}>Страница ВК</a>
					</p>
					<h2 style={{ fontSize: '18px' }}>Место жительства:</h2>
					<p className="personale_data">Страна: {user?.residency.country}</p>
					<p className="personale_data">Регион: {user?.residency.region}</p>
					<p className="personale_data">Район: {user?.residency.locality}</p>
				</div>
				<div style={{ width: '100%', display: 'block' }}>
					<h2 style={{ fontSize: '19px', marginBottom: 0, textAlign: 'center' }}>Декларация моей Родной партии:</h2>
				</div>
				<div style={{ width: '100%' }}>
					<p className="personale_data" style={{ whiteSpace: 'pre' }}>
						{user?.declaration?.declaration}
					</p>
				</div>
			</div>
		</>
	);

	return (
		<div>
			<header className="header">
				<div className="header__wrapper">
					<HeaderLogoMobile />
					<HeaderLogoRegistr />
				</div>
			</header>

			<div className="middle">
				<div className="middle__wrapper">
					<NavMiddle />
					<div className="main__screen main__screen_home">
						<div id="list_founders">{personaleData}</div>

						<div className="main__screen-flag"></div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default observer(Personale_kard);
