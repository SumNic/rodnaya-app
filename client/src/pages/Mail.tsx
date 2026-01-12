import { observer } from 'mobx-react-lite';
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
						<Title
							level={2}
							style={{
								fontSize: 18,
								marginTop: 50,
								maxWidth: 720,
								lineHeight: 1.6,
								fontWeight: 400,
								textAlign: 'center',
								opacity: 0.85,
							}}
						>
							Этот раздел сейчас находится в разработке.
							<br />
							Совсем скоро здесь появится возможность обмениваться личными сообщениями с другими участниками сообщества.
						</Title>

						<div className="main__screen-flag"></div>
					</div>
				</div>
			</div>

			{/* <Footer /> */}
		</div>
	);
};

export default observer(Mail);
