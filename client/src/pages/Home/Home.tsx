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
import { Button, Typography } from 'antd';
import MyButton from '../../components/MyButton/MyButton';
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import WebApp from '@twa-dev/sdk';

const { Paragraph } = Typography;

const Home: React.FC = () => {
	const [mobileLogin, setMobileLogin] = useState(false);
	const [isTelegram, setIsTelegram] = useState(false);

	const { store } = useStoreContext();

	const { currentWidth } = useThemeContext();
	const { loginWithVkMobile } = store.authStore;

	useEffect(() => {
		if (mobileLogin) loginWithVkMobile();
	}, [mobileLogin]);

	useEffect(() => {
		if (WebApp.initDataUnsafe?.user) {
			setIsTelegram(true);
		} else {
			setIsTelegram(false);
		}
	}, []);

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
					<div className={styles.wrapper}>
						<section id="list_founders">
							<div style={{ display: 'flex', justifyContent: 'center', width: '100' }}>
								<h1 className={styles['founders-title']}>
									🌿 Родная партия — объединение людей, создающих пространство Любви
								</h1>
							</div>

							{!store.authStore.isAuth && (
								<div className={styles.wrapper_p}>
									<p className={styles['founders-description']}>
										&nbsp;Чтобы присоединиться к нашему сообществу и общаться с единомышленниками, войдите через VK ID.
									</p>
								</div>
							)}

							{!store.authStore.isAuth && (
								<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
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
							)}
							{!store.authStore.isAuth && (
								<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
									<small className={styles['vk-login-note']}>Для входа использовать уведомление ВКонтакте</small>
								</div>
							)}

							<div className={styles.wrapper_p}>
								<div className={styles['founders-section']}>
									<p className={styles['founders-description']}>
										<strong>Родная партия</strong> — это сообщество людей, которым близки идеи серии{' '}
										<em>«Звенящие кедры России»</em> и которые стремятся вернуть в жизнь народа образ жизни, обряды и
										традиции, способные навечно сохранять любовь в семьях.
									</p>
								</div>
							</div>

							<div className={styles.wrapper_p}>
								<p className={styles['founders-description']}>
									&nbsp;Это движение не имеет властного центра.
									<br />
									Каждый человек сам управляет своей жизнью, а важные решения принимаются{' '}
									<strong>вечевым способом</strong> — открыто, честно, в согласии и уважении.
								</p>
							</div>

							<h2 className={styles['founders-subheading']}>🌱 Что такое Родная партия?</h2>

							<div className={styles.wrapper_p}>
								<p className={styles['founders-description']}>
									&nbsp;Это не формальная структура и не обычная политическая организация.
									<br />
									&nbsp;Родная партия <strong>не нуждается в официальной регистрации</strong>, потому что она создаётся
									не документами, а людьми — их светлыми мыслями, добрыми делами и стремлением к созиданию.
									<br />
									&nbsp;Каждый человек, который разделяет эти идеи, может <strong>учредить свою Родную партию</strong>,
									так же как это сделал дедушка Анастасии.
									<br />
									&nbsp;А этот сайт создан для того, чтобы <strong>объединять таких учредителей</strong>, чтобы мы могли
									видеть друг друга, общаться, поддерживать и усиливать общее дело.
								</p>
							</div>

							<h2 className={styles['founders-subheading']}>💛 Наша миссия</h2>

							<div className={styles.wrapper_p}>
								<p className={styles['founders-description']}>
									&nbsp;Мы стремимся, чтобы тема любви в семьях звучала не только в личных разговорах, но и{' '}
									<strong>на уровне народа и страны</strong>.
									<br />
									&nbsp;Ведь если в каждой семье хранится Любовь — процветает и весь народ.
									<br />
									&nbsp;Мы хотим, чтобы в обществе звучали темы:
								</p>
							</div>

							<div style={{ display: 'flex', justifyContent: 'center' }}>
								<Typography>
									<Paragraph>
										<ul>
											<li>любви</li>
											<li>нравственности</li>
											<li>родовых традиций</li>
											<li>созидательного образа жизни</li>
											<li>духовной чистоты</li>
											<li>воспитания гармоничных детей</li>
										</ul>
									</Paragraph>
								</Typography>
							</div>

							<div className={styles.wrapper_p}>
								<p className={styles['founders-description']}>
									&nbsp;Это то, что веками было естественной основой жизни людей. И оно должно вернуться.
								</p>
							</div>

							<h2 className={styles['founders-subheading']}>🤝 Присоединяйтесь</h2>

							<div className={styles.wrapper_p}>
								<p className={styles['founders-description']}>
									&nbsp;По ссылкам ниже вы можете увидеть список учредителей Родной партии и вступить в наше открытое
									сообщество:
								</p>
							</div>

							<div style={{ display: 'flex', justifyContent: 'center' }}>
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
									<li>
										<Link to="/rules" className="list_founders">
											Правила сайта
										</Link>
									</li>
								</ul>
							</div>

							{!Capacitor.isNativePlatform() && !isTelegram && (
								<>
									<h2 className={styles['founders-subheading']}>📲 Скачайте наше приложение</h2>
									<div className={styles.wrapper_p}>
										<p className={styles['founders-description']}>
											Хотите использовать наше приложение на Android? Просто скачайте его по ссылке ниже!
										</p>
									</div>
									<div style={{ display: 'flex', justifyContent: 'center' }}>
										<a
											href="https://storage.yandexcloud.net/new-carpet/app/app-release.apk"
											target="_blank"
											rel="noopener noreferrer"
										>
											<Button type="primary" style={{ padding: '20px' }}>
												Скачать для Android
											</Button>
										</a>
									</div>

									<h2 className={styles['founders-subheading']}>💬 Откройте приложение в Телеграм</h2>
									<div className={styles.wrapper_p}>
										<p className={styles['founders-description']}>
											Присоединяйтесь к нашему сообществу через Telegram, чтобы получать актуальные новости и общаться с
											другими участниками!
										</p>
									</div>
									<div style={{ display: 'flex', justifyContent: 'center' }}>
										<a href="https://t.me/rodnaya_partya_bot" target="_blank" rel="noopener noreferrer">
											<Button type="primary" style={{ padding: '20px' }}>
												Открыть в Telegram
											</Button>
										</a>
									</div>
								</>
							)}
							<h2 className={styles['founders-subheading']}>{isTelegram}</h2>

							{/* <div className="rules"> */}
							<h2 className={styles['founders-subheading']}>🙏 Поддержите проект</h2>
							<div className={styles.wrapper_p}>
								<p className={styles['founders-description']}>
									&nbsp;Если вы считаете важным наше общее дело и хотите помочь развитию ресурса, вы можете внести
									посильный вклад, нажав на кнопку ниже.
								</p>
							</div>

							{/* </div> */}
							<div className="support-button-container" style={{ paddingBottom: '30px' }}>
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
