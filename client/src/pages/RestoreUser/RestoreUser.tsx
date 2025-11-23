import HeaderLogoRegistr from '../../components/HeaderLogo/HeaderLogoRegistr';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';
import { HOME_ROUTE, PERSONALE_ROUTE } from '../../utils/consts';
import { useStoreContext } from '../../contexts/StoreContext';
import { Button, Typography } from 'antd';
import React, { useState } from 'react';
import { useThemeContext } from '../../contexts/ThemeContext';
import NavMiddle from '../../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile';
import styles from './RestoreUser.module.css';

const { Title } = Typography;

const RestoreUser: React.FC = () => {
	const [isLoading, setIsLoading] = useState(false);

	const { store } = useStoreContext();

	const navigate = useNavigate();

	const { currentWidth } = useThemeContext();

	const location = useLocation();
	const { user } = location.state;

	function restoreProfile() {
		setIsLoading(true);
		store.authStore
			.restoreProfile(user.id, user.secret)
			.then(() => store.authStore.loginVk(user.id, user.secret))
			.then(() => {
				setIsLoading(false);
				navigate(PERSONALE_ROUTE);
			});
	}

	function delProfile() {
		store.authStore.setDelProfile(true);
		navigate(HOME_ROUTE);
	}

	return (
		<div>
			<header className="header">
				<div className="header__wrapper">
					{currentWidth && currentWidth < 830 && <NavMiddle item={PERSONALE_ROUTE} />}
					<HeaderLogoMobile />
					<HeaderLogoRegistr />
				</div>
			</header>

			<div className="middle">
				<div className="middle__wrapper">
					{currentWidth && currentWidth >= 830 && <NavMiddle item={PERSONALE_ROUTE} />}
					<div className={`main__screen main__screen_home ${styles.wrapper}`}>
						<div className="form__registr" style={{ textAlign: 'justify' }}>
							<Title level={2} style={{ fontSize: '18px' }}>
								Ваш профиль удалён. Хотите восстановить свой профиль?
							</Title>
							<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
								<Button onClick={delProfile}>Отменить</Button>
								<Button type="primary" onClick={restoreProfile} loading={isLoading}>
									Восстановить
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* <Footer /> */}
		</div>
	);
};

export default observer(RestoreUser);
