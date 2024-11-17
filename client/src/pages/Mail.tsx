import { observer } from 'mobx-react-lite';
import Footer from '../components/Footer';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../components/HeaderLogo/HeaderLogoMobile';
import React from 'react';
import HeaderLogoRegistr from '../components/HeaderLogo/HeaderLogoRegistr';
import { MAIL_ROUTE } from '../utils/consts';
import { Typography } from 'antd';

const { Title } = Typography;

const Mail: React.FC = () => {
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
					<NavMiddle item={MAIL_ROUTE} />
					<div className="main__screen main__screen_home">
						<Title level={2} style={{ fontSize: '18px', marginTop: '50px' }}>
							Этот раздел находится в разработке. В будущем здесь будет доступна возможность обмена личными
							сообщениями с другими участниками.
						</Title>

						<div className="main__screen-flag"></div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default observer(Mail);
