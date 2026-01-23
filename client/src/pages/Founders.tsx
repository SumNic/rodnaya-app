import { observer } from 'mobx-react-lite';
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

	// Фильтруем пользователей, которые не удалены
	const residencies = store.locationStore.isResidency
		.map((res: any) => ({
			...res,
			users: res.users.filter((user: any) => !user.isDelProfile),
		}))
		.filter((res: any) => res.users.length > 0);

	// Группируем по странам и регионам
	const grouped = residencies.reduce((acc: any, res: any) => {
		if (!acc[res.country]) acc[res.country] = {};
		if (!acc[res.country][res.region]) acc[res.country][res.region] = [];
		acc[res.country][res.region].push(...res.users);
		return acc;
	}, {});

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
								{Object.entries(grouped).map(([country, regions]: any, index) => (
									<ul key={index} className="ul_founders">
										<h2 className="name__local_founders">{country}</h2>
										{Object.entries(regions).map(([region, users]: any, idx) => (
											<ul key={idx} className="ul_founders">
												<h2 className="name__local_founders">{region}</h2>
												<FoundersList founders={users} />
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
