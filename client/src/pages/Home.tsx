import { Link } from 'react-router-dom';
import AuthVkButton from '../components/AuthVkButton';
import Footer from '../components/Footer';
import HeaderLogoMobile from '../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../components/HeaderLogo/HeaderLogoRegistr';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import { observer } from 'mobx-react-lite';
import { FOUNDERS_ROUTE, HOME_ROUTE } from '../utils/consts';
import { useStoreContext } from '../contexts/StoreContext';
import MyButton from '../components/MyButton/MyButton';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { useEffect, useState } from 'react';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { Http } from '@capacitor-community/http';

const Home: React.FC = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkPlatform = () => {
		const platform = Capacitor.getPlatform(); // Получаем платформу

		if (platform === 'android' || platform === 'ios') {
			setIsMobile(true); // Устанавливаем состояние, если приложение работает на мобильной платформе
		} else {
			setIsMobile(false); // Устанавливаем состояние, если приложение работает на web
		}
		};

		checkPlatform(); // Вызываем функцию для проверки платформы
	}, []);
	
	// const [deviceId, setDeviceId] = useState('');
	const { store } = useStoreContext();

	// const navigate = useNavigate();

	const app_id = 52707211;
	const VKIDRedirectScheme = 'vk' + app_id;
	const state = 'lxkpdofgprekflererjgjgore';
	const codeVerifier = 'tr8tHYB2bc2AJenj96cRJXw62aQ_3p8KHQAR6M8M__k';
	const codeChallenge = '4vTm_rBv33yepcOPURqZT5OsjCCzgC2s5CWU-Mw5bho';

	const enterWithVKID = async () => {
		const url = `https://id.vk.com/auth?state=${state}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=sha256&app_id=${app_id}&v=0.0.2&redirect_uri=vk${app_id}://vk.com&uuid=65464578756465`;

		// if (Capacitor.isNative) {
	await Browser.open({ url });
		// } else {
		// window.open(url, '_blank'); // В веб-версии
		// }
	};

	useEffect(() => {
		const handleUrlOpen = (event: any) => {
			const { url } = event;

			if (url.includes(VKIDRedirectScheme)) {
				const urlParams = new URL(url);

				const dataParam = urlParams.searchParams.get('payload');

				if (dataParam) {
					const decodedData = decodeURIComponent(dataParam);
					const jsonData = JSON.parse(decodedData);

					const checkState = jsonData.oauth.state;

					if (checkState === state) {
						const code = jsonData.oauth.code;
						getAccessToken(code);
					}

					console.log(state);
				} else {
					console.log('Параметр data не найден в URL');
				}
			}
		};

		App.addListener('appUrlOpen', handleUrlOpen);

		return () => {
			App.removeAllListeners();
		};
	}, []);

	async function getAccessToken(code: string) {
		console.log(code, 'code');

		const info = await Device.getId(); // Получаем информацию о устройстве
		const deviceId = info.identifier;

		try {
			const url = 'https://oauth.vk.com/access_token'; // Ваш URL
			// Устанавливаем данные для POST-запроса
			const data = new URLSearchParams({
				client_id: `${app_id}`,
				client_secret: 'KYdTDMAE5lH7j2ajEIan',
				code_verifier: `${codeVerifier}`,
				device_id: deviceId,
				code: code,
				redirect_uri: `vk${app_id}://vk.com`,
			});

			console.log(data.toString(), 'data.toString()');

			// Отправляем POST-запрос
			const response = await Http.post({
				url, 
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded', // Указываем тип данных
				},
				data: data.toString(), 
			});

			// Обрабатываем ответ
			console.log('Response data:', response.data);
		} catch (error: any) {
			console.error('Error message:', error.message || error);
		}
	}

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
						<section id="list_founders" className="founders-section">
							<h1 className="founders-title">Родная партия</h1>

							<p className="founders-description">
								Сайт 'Родная партия' создан для тех, кто поддерживает идеи, изложенные в серии книг 'Звенящие кедры
								России' Владимира Мегре, и учредили свою Родную партию, как это сделал дедушка Анастасии.
							</p>

							<p className="founders-description">
								Этот ресурс объединяет единомышленников, нацеленных на возвращение энергии Любви в семьи.
							</p>

							<p className="founders-call-to-action">
								Если ты считаешь себя учредителем своей Родной партии, присоединяйся к нам!
							</p>

							{isMobile ? <MyButton text="Войти с VK ID" onClick={enterWithVKID} /> :
							!store.isAuth && <AuthVkButton />}

							<h2 className="founders-subheading">Хотите узнать больше?</h2>
							<p className="founders-details">
								Перейдите по ссылкам ниже, чтобы увидеть список учредителей Родной партии и присоединиться к нам в
								ВКонтакте:
							</p>

							<ul className="founders-list">
								<li>
									<Link to={FOUNDERS_ROUTE} className="list_founders">
										Учредители Родной партии
									</Link>
								</li>
								<li>
									<Link to="https://vk.com/club166722362" className="list_founders">
										Родная партия в ВК
									</Link>
								</li>
							</ul>
						</section>

						<div className="main__screen-flag"></div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default observer(Home);
