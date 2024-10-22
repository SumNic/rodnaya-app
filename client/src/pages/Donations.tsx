import Footer from '../components/Footer';
import HeaderLogoMobile from '../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../components/HeaderLogo/HeaderLogoRegistr';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import { HOME_ROUTE } from '../utils/consts';
import { useStoreContext } from '../contexts/StoreContext';

const Donations: React.FC = () => {
	const { store } = useStoreContext();

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
					{store.isAuth && <NavMiddle item={HOME_ROUTE} />}
					{!store.isAuth && <nav className="middle__menu"></nav>}
					<div className="main__screen main__screen_home">
						<div id="list_founders" style={{paddingTop: '50px'}}>
							<div className="rules" style={{ textAlign: 'justify' }}>
								<p style={{ textIndent: '30px', fontSize: '18px' }}>
									Чтобы поддержать сайт Родная партия, вы можете перевести любую сумму, перейдя по кнопке Перевести:
								</p>
							</div>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                                <iframe
                                    src="https://yoomoney.ru/quickpay/fundraise/button?billNumber=H28j3gJ3nHw.230111&"
                                    width="237"
                                    height="50"
                                    scrolling="no"
                                />
                            </div>
							
						</div>

						<div className="main__screen-flag"></div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default Donations;
