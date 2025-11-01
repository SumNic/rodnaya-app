import { Link } from 'react-router-dom';
import AuthVkButton from '../components/AuthVkButton';
import HeaderLogoMobile from '../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../components/HeaderLogo/HeaderLogoRegistr';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import { observer } from 'mobx-react-lite';
import { API_URL, FOUNDERS_ROUTE, HOME_ROUTE } from '../utils/consts';
import { useStoreContext } from '../contexts/StoreContext';
import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { Http } from '@capacitor-community/http';
import { useThemeContext } from '../contexts/ThemeContext';

const Home: React.FC = () => {
	// const [isMobile, setIsMobile] = useState(false);

	// useEffect(() => {
	// 	const checkPlatform = () => {
	// 		const platform = Capacitor.getPlatform(); // Получаем платформу

	// 		if (platform === 'android' || platform === 'ios') {
	// 			setIsMobile(true); // Устанавливаем состояние, если приложение работает на мобильной платформе
	// 		} else {
	// 			setIsMobile(false); // Устанавливаем состояние, если приложение работает на web
	// 		}
	// 	};

	// 	checkPlatform(); // Вызываем функцию для проверки платформы
	// }, []);

	// const [deviceId, setDeviceId] = useState('');
	const { store } = useStoreContext();

	const { currentWidth } = useThemeContext();

	// const navigate = useNavigate();

	const app_id = 52707211;
	const VKIDRedirectScheme = 'vk' + app_id;
	const state = 'lxkpdofgprekflererjgjgore';
	const codeVerifier = 'tr8tHYB2bc2AJenj96cRJXw62aQ_3p8KHQAR6M8M__k';

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
		const info = await Device.getId(); // Получаем информацию о устройстве
		const deviceId = info.identifier;

		try {
			const url = 'https://oauth.vk.ru/access_token'; // Ваш URL
			// Устанавливаем данные для POST-запроса
			const data = new URLSearchParams({
				client_id: `${app_id}`,
				client_secret: 'KYdTDMAE5lH7j2ajEIan',
				code_verifier: `${codeVerifier}`,
				device_id: deviceId,
				code: code,
				redirect_uri: `vk${app_id}://vk.ru`,
			});

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
					{currentWidth && currentWidth < 830 && <NavMiddle item={HOME_ROUTE} />}
					<HeaderLogoMobile />
					<HeaderLogoRegistr />
				</div>
			</header>

			<div className="middle">
				<div className="middle__wrapper">
					{currentWidth && currentWidth >= 830 && <NavMiddle item={HOME_ROUTE} />}
					<div className="main__screen main__screen_home">
						<section id="list_founders" className="founders-section">
							<h1 className="founders-title">Родная партия</h1>
							<p>{API_URL}</p>
							<p className="founders-description">
								Сайт 'Родная партия' создан для тех, кто поддерживает идеи, изложенные в серии книг 'Звенящие кедры
								России' Владимира Мегре, и учредили свою Родную партию, как это сделал дедушка Анастасии.
							</p>

							<p className="founders-description">
								Этот ресурс объединяет единомышленников, нацеленных на возвращение энергии Любви в семьи.
							</p>

							{!store.authStore.isAuth && (
								<p className="founders-call-to-action">
									Если ты считаешь себя учредителем своей Родной партии, присоединяйся к нам!
								</p>
							)}

							<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
								<div style={{ minWidth: '237px' }}>{!store.authStore.isAuth && <AuthVkButton />}</div>
							</div>
							{!store.authStore.isAuth && (
								<div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
									<small className="vk-login-note">
										При входе использовать не мобильное приложение ВКонтакте, а с помощью уведомления!
									</small>
								</div>
							)}

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
									<Link to="https://vk.ru/club166722362" className="list_founders">
										Родная партия в ВК
									</Link>
								</li>
							</ul>

							{/* <div className="rules"> */}
							<h2 className="founders-subheading">Поддержите наш проект!</h2>
							<p className="founders-details">
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
