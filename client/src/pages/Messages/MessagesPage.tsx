import { observer } from 'mobx-react-lite';
import NavMiddle from '../../components/Nav_middle/NavMiddle.tsx';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile.tsx';
import NavRegions from '../../components/Nav_header/NavRegions.tsx';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStoreContext } from '../../contexts/StoreContext.ts';
import { HOME_ROUTE, MESSAGES, MESSAGES_ROUTE } from '../../utils/consts.tsx';
import { Modal, Typography } from 'antd';
import HeaderLogoPc from '../../components/HeaderLogo/HeaderLogoPc.tsx';
import Messages from './components/Messages.tsx';

const { Text } = Typography;

const MessagePage: React.FC = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);

	const navigate = useNavigate();

	const { store } = useStoreContext();
	const { user } = store.authStore;

	const params = useParams();
	const location: string | undefined = params.location;

	const nameLocal = useMemo(() => {
		let name = '';
		switch (location) {
			case 'locality':
				name = user.residency.locality || '';
				break;
			case 'region':
				name = user.residency.region || '';
				break;
			case 'country':
				name = user.residency.country || '';
				break;
			case 'world':
				name = 'Земля';
				break;
			default:
				setModalOpen(true);
				break;
		}
		return name;
	}, [location]);

	return (
		<div>
			<header className="header">
				<div className="header__wrapper">
					<HeaderLogoPc />
					<HeaderLogoMobile />
					{location && <NavRegions location={location} source={MESSAGES} route={MESSAGES_ROUTE} />}
				</div>
			</header>
			<div className="middle">
				<div className="middle__wrapper">
					<NavMiddle item={MESSAGES_ROUTE} />
					<div className="main__screen main__screen_home logotip-background">
						<div className="name">
							<h2 className="name__local" id="name">
								{nameLocal}
							</h2>
						</div>
						{location && <Messages location={location} source={MESSAGES} />}
					</div>
				</div>
			</div>
			<Modal open={modalOpen} onOk={() => navigate(HOME_ROUTE)} onCancel={() => setModalOpen(false)} width={400}>
				<Text>Страница не существует. Вернуться на главную?</Text>
			</Modal>
			{/* <Footer /> */}
		</div>
	);
};

export default observer(MessagePage);
