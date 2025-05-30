import React, { useEffect, useState } from 'react';
import { useThemeContext } from '../../contexts/ThemeContext';
import NavMiddle from '../../components/Nav_middle/NavMiddle';
import { GROUP_ROUTE } from '../../utils/consts';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile';
import { observer } from 'mobx-react-lite';
import HeaderLogoRegistr from '../../components/HeaderLogo/HeaderLogoRegistr';
import { useStoreContext } from '../../contexts/StoreContext';
import { useParams } from 'react-router-dom';
import Footer from '../../components/Footer';
import { IGroup } from '../../models/response/IGroup';
import GroupElement from './components/GroupElement';

const OneGroup: React.FC = () => {
	const [isLoadGroup, setIsLoadGroup] = useState(false);
	const [group, setGroup] = useState<IGroup>();

	const { currentWidth } = useThemeContext();

	const { id } = useParams();

	const { store } = useStoreContext();
	const { getOneGroup } = store.groupStore;

	useEffect(() => {
		getGroup();
	}, [id]);

	const getGroup = async () => {
		try {
			if (id) {
				setIsLoadGroup(true);
				const response = await getOneGroup(+id);
				if (response?.data) {
					setGroup(response.data);
				}
				setIsLoadGroup(false);
			}
		} catch (err) {
			setIsLoadGroup(false);
			console.error(`Ошибка в loadGroups: ${err}`);
		}
	};

	return (
		<div>
			<header className="header">
				<div className="header__wrapper">
					{currentWidth && currentWidth < 830 && <NavMiddle item={GROUP_ROUTE} />}
					<HeaderLogoMobile />
					<HeaderLogoRegistr />
				</div>
			</header>

			<div className="middle">
				<div className="middle__wrapper">
					{currentWidth && currentWidth >= 830 && <NavMiddle item={GROUP_ROUTE} />}
					<div className="main__screen main__screen_home">
						<div id="list_founders">{group && <GroupElement group={group} isLoadingGroup={isLoadGroup} />}</div>

						<div className="main__screen-flag"></div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default observer(OneGroup);
