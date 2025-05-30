import Footer from '../components/Footer';
import HeaderLogoMobile from '../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../components/HeaderLogo/HeaderLogoRegistr';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import { useThemeContext } from '../contexts/ThemeContext';
import { HOME_ROUTE } from '../utils/consts';

const Donations: React.FC = () => {

	const { currentWidth } = useThemeContext();

	return (
		<div>
			<header className="header">
				<div className="header__wrapper">
					{currentWidth && currentWidth < 830 && <NavMiddle item={HOME_ROUTE} />}
					<HeaderLogoMobile />
					<HeaderLogoRegistr />
				</div>
			</header>

			<div className="middle">
				<div className="middle__wrapper">
					{currentWidth && currentWidth >= 830 && <NavMiddle item={HOME_ROUTE} />}
					<div className="main__screen main__screen_home">
						<div id="list_founders" className="support-section">
							<div className="rules">
								<h2 className="founders-subheading">Поддержите наш проект!</h2>
								<p className="founders-details">
									Если вы цените наш труд и хотите помочь развивать этот ресурс, вы можете перевести любую сумму, нажав
									на кнопку ниже. Ваша поддержка важна для нас!
								</p>
							</div>
							<div className="support-button-container">
								{/* <button></button> */}
								<iframe
									src="https://yoomoney.ru/quickpay/fundraise/button?billNumber=H28j3gJ3nHw.230111&"
									width="237"
									height="50"
									scrolling="no"
									className="support-button"
								/>
							</div>
						</div>
						<div className="main__screen-flag"></div>
					</div>
				</div>
			</div>

			{/* <Footer /> */}
		</div>
	);
};

export default Donations;
