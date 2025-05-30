import { observer } from 'mobx-react-lite';
import Footer from '../components/Footer';
import NavMiddle from '../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../components/HeaderLogo/HeaderLogoMobile';
import { useEffect } from 'react';
import HeaderLogoRegistr from '../components/HeaderLogo/HeaderLogoRegistr';
import { useStoreContext } from '../contexts/StoreContext';
import { useThemeContext } from '../contexts/ThemeContext';
import FoundersList from '../components/FoundersList';

function Founders() {
	const { store } = useStoreContext();

	const { currentWidth } = useThemeContext();

	useEffect(() => {
		store.locationStore.getAllResidencys();
	}, [store]);

	return (
		<div>
			<header className="header">
				<div className="header__wrapper">
					{currentWidth && currentWidth < 830 && <NavMiddle />}
					<HeaderLogoMobile />
					<HeaderLogoRegistr />
				</div>
			</header>

			<div className="middle">
				<div className="middle__wrapper">
					{currentWidth && currentWidth >= 830 && <NavMiddle />}
					<div className="main__screen main__screen_home">
						<div id="list_founders">
							<div className="scroll_bar">
								{store.locationStore.isResidency
									.map((item: any) => item.users.length !== 0 && item.country)
									.filter((item, index, arr) => arr.indexOf(item) === index)
									.map((item_country: any, index: any) => (
										<ul key={index} className="ul_founders">
											<h2 className="name__local_founders" id="name">
												{item_country}
											</h2>
											{store.locationStore.isResidency
												.map((item: any) => item.users.length !== 0 && item.country === item_country && item.region)
												.filter((item, index, arr) => arr.indexOf(item) === index)
												.map((item_region: any, index: any) => (
													<ul key={index} className="ul_founders">
														<h2 className="name__local_founders" id="name">
															{item_region}
														</h2>
														{store.locationStore.isResidency.map(
															(item: any, index: number) =>
																item.country === item_country &&
																item.region === item_region && <FoundersList key={index} founders={item.users} />
														)}
													</ul>
												))}
										</ul>
									))}
							</div>
						</div>

						<div className="main__screen-flag"></div>
					</div>
				</div>
			</div>

			{/* <Footer /> */}
		</div>
	);
}

export default observer(Founders);
