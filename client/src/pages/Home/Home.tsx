import { Link } from 'react-router-dom';
import AuthVkButton from '../../components/AuthVkButton';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../../components/HeaderLogo/HeaderLogoRegistr';
import NavMiddle from '../../components/Nav_middle/NavMiddle';
import { observer } from 'mobx-react-lite';
import { FOUNDERS_ROUTE, HOME_ROUTE } from '../../utils/consts';
import { useStoreContext } from '../../contexts/StoreContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import styles from './Home.module.css';

const Home: React.FC = () => {
	const { store } = useStoreContext();

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
				<div className={'middle__wrapper'}>
					{currentWidth && currentWidth >= 830 && <NavMiddle item={HOME_ROUTE} />}
					<div className={`main__screen main__screen_home ${styles.wrapper}`}>
						<section id="list_founders" className={styles['founders-section']}>
							<h1 className={styles['founders-title']}>Родная партия</h1>

							<p className={styles['founders-description']}>
								Сайт 'Родная партия' создан для тех, кто поддерживает идеи, изложенные в серии книг 'Звенящие кедры
								России' Владимира Мегре, и учредили свою Родную партию, как это сделал дедушка Анастасии.
							</p>

							<p className={styles['founders-description']}>
								Этот ресурс объединяет единомышленников, нацеленных на возвращение энергии Любви в семьи.
							</p>

							{!store.authStore.isAuth && (
								<p className={styles['founders-call-to-action']}>
									Если ты считаешь себя учредителем своей Родной партии, присоединяйся к нам!
								</p>
							)}

							<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
								<div style={{ minWidth: '237px' }}>{!store.authStore.isAuth && <AuthVkButton />}</div>
							</div>
							{!store.authStore.isAuth && (
								<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
									<small className={styles['vk-login-note']}>Для входа использовать уведомление ВКонтакте</small>
								</div>
							)}

							<h2 className={styles['founders-subheading']}>Хотите узнать больше?</h2>
							<p className={styles['founders-details']}>
								Перейдите по ссылкам ниже, чтобы увидеть список учредителей Родной партии и присоединиться к нам в
								ВКонтакте:
							</p>

							<ul className={styles['founders-list']}>
								<li>
									<Link to={FOUNDERS_ROUTE} className="list_founders">
										Учредители Родной партии
									</Link>
								</li>
								<li>
									<Link to="https://vk.ru/club166722362" className="list_founders">
										Родная партия в ВК
									</Link>
								</li>
							</ul>

							{/* <div className="rules"> */}
							<h2 className={styles['founders-subheading']}>Поддержите наш проект!</h2>
							<p className={styles['founders-details']}>
								Если вы считаете полезным этот ресурс и хотите финансово его поддержать, вы можете перевести любую
								сумму, нажав на кнопку ниже.
							</p>
							{/* </div> */}
							<div className="support-button-container">
								<iframe
									src="https://yoomoney.ru/quickpay/fundraise/button?billNumber=H28j3gJ3nHw.230111&"
									width="237"
									height="50"
									scrolling="no"
									className="support-button"
								/>
							</div>
						</section>

						<div className="main__screen-flag"></div>
					</div>
				</div>
			</div>

			{/* <Footer /> */}
		</div>
	);
};

export default observer(Home);
