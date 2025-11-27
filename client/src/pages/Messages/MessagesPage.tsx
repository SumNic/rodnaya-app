import { observer } from 'mobx-react-lite';
import NavMiddle from '../../components/Nav_middle/NavMiddle.tsx';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile.tsx';
import NavRegions from '../../components/Nav_header/NavRegions.tsx';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStoreContext } from '../../contexts/StoreContext.ts';
import { HOME_ROUTE, MESSAGES, MESSAGES_ROUTE } from '../../utils/consts.tsx';
import { Modal, Typography } from 'antd';
import HeaderLogoPc from '../../components/HeaderLogo/HeaderLogoPc.tsx';
import Messages from './components/Messages.tsx';
import AuthVkButton from '../../components/AuthVkButton.tsx';
import styles from './MessagesPage.module.css';
import MyButton from '../../components/MyButton/MyButton.tsx';
import { Capacitor } from '@capacitor/core';

const { Text } = Typography;

const MessagePage: React.FC = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [mobileLogin, setMobileLogin] = useState(false);

	const navigate = useNavigate();

	const { store } = useStoreContext();
	const { user, loginWithVkMobile } = store.authStore;

	const params = useParams();
	const location: string | undefined = params.location;

	useEffect(() => {
		if (!store.authStore.isAuth) {
			setIsAuthModalOpen(true);
		}
	}, [store.authStore.isAuth]);

	useEffect(() => {
		store.filesStore.resetFiles();
	}, [location]);

	useEffect(() => {
		if (mobileLogin) loginWithVkMobile();
	}, [mobileLogin]);

	const nameLocal = useMemo(() => {
		if (!store.authStore.isAuth) return;
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
	}, [location, store.authStore.isAuth]);

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
						{store.authStore.isAuth && location && <Messages location={location} source={MESSAGES} />}
					</div>
				</div>
			</div>
			<Modal open={modalOpen} onOk={() => navigate(HOME_ROUTE)} onCancel={() => setModalOpen(false)} width={400}>
				<Text>Страница не существует. Вернуться на главную?</Text>
			</Modal>
			<Modal
				open={isAuthModalOpen}
				onOk={() => navigate(HOME_ROUTE)}
				onCancel={() => setIsAuthModalOpen(false)}
				centered
				footer={''}
			>
				<div className={styles.authWrapper}>
					<div className={styles.authMessage}>Эта страница доступна только авторизованным пользователям!</div>
					<div className={styles.authButtonWrapper}>
						{Capacitor.isNativePlatform() ? (
							<div style={{ maxWidth: '237px', width: '100%', marginRight: '10px' }}>
								<MyButton text="Войти с VK ID" onClick={() => setMobileLogin(true)} />
							</div>
						) : (
							<div style={{ minWidth: '237px' }}>
								<AuthVkButton />
							</div>
						)}
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default observer(MessagePage);
