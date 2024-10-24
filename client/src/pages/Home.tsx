import { Link } from 'react-router-dom';
import AuthVkButton from '../components/AuthVkButton';
import Footer from '../components/Footer';
import HeaderLogoMobile from '../components/HeaderLogo/HeaderLogoMobile';
import HeaderLogoRegistr from '../components/HeaderLogo/HeaderLogoRegistr';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import { observer } from 'mobx-react-lite';
import { FOUNDERS_ROUTE, HOME_ROUTE } from '../utils/consts';
import { useStoreContext } from '../contexts/StoreContext';

function Home() {
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
						<section id="list_founders" className="founders-section">
							<h1 className="founders-title">Родная партия</h1>

							<p className="founders-description">
								Сайт 'Родная партия' создан для тех, кто поддерживает идеи, изложенные в серии книг
								'Звенящие кедры России' Владимира Мегре, и учредили свою Родную партию, как это сделал дедушка Анастасии.
							</p>

							<p className="founders-description">
								Этот ресурс объединяет единомышленников, нацеленных на возвращение энергии Любви в семьи.
							</p>

							<p className="founders-call-to-action">
								Если ты считаешь себя учредителем своей Родной партии, присоединяйся к нам!
							</p>

							{!store.isAuth && <AuthVkButton />}

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
}

export default observer(Home);
