import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	EXIT_ROUTE,
	HOME_ROUTE,
	MESSAGES_ROUTE,
	PERSONALE_ROUTE,
	PUBLICATION_ROUTE,
	GROUP_ROUTE,
	MAIL_ROUTE,
	VECHE_ROUTE,
} from '../../utils/consts';
import { Badge, Menu } from 'antd';
import {
	HomeOutlined,
	ReadOutlined,
	MessageOutlined,
	TeamOutlined,
	PhoneOutlined,
	MailOutlined,
	UserOutlined,
	LogoutOutlined,
} from '@ant-design/icons';

import { useThemeContext } from '../../contexts/ThemeContext';

import { observer } from 'mobx-react-lite';
import { useStoreContext } from '../../contexts/StoreContext';

import styles from './Nav_middle.module.css';

interface Item {
	item?: string;
}

const NavMiddle: React.FC<Item> = ({ item = '' }) => {
	const [isCollapse, setIsCollapse] = useState<boolean>(true);

	const { currentWidth } = useThemeContext();

	const { store } = useStoreContext();
	const { arrCountNoReadMessages } = store.messageStore;
	const { arrCountNoReadPostsGroups } = store.groupStore;

	const allCountAreZero = arrCountNoReadMessages?.every((item) => item.count <= 0);
	const isNoReadPostToGroups = arrCountNoReadPostsGroups?.every((item) => item.count <= 0);

	const menuItems = [];

	menuItems.push({
		key: HOME_ROUTE,
		label: (
			<Link to={HOME_ROUTE}>
				<HomeOutlined style={{ marginRight: 8 }} />
				Главная
			</Link>
		),
	});

	menuItems.push({
		key: PUBLICATION_ROUTE,
		label: (
			<Link to={PUBLICATION_ROUTE}>
				<ReadOutlined style={{ marginRight: 8 }} />
				Публикации
			</Link>
		),
	});

	menuItems.push({
		key: MESSAGES_ROUTE,
		label: (
			<Link to={`${MESSAGES_ROUTE}/locality`} className={styles['middle__link']}>
				<MessageOutlined style={{ marginRight: 8 }} />
				Чаты
				{!allCountAreZero ? <Badge style={{ boxShadow: 'none' }} dot /> : ''}
			</Link>
		),
	});

	menuItems.push({
		key: GROUP_ROUTE,
		label: (
			<Link to={`${GROUP_ROUTE}/locality`} className="middle__link">
				<TeamOutlined style={{ marginRight: 8 }} />
				Группы
				{!isNoReadPostToGroups ? <Badge style={{ boxShadow: 'none' }} dot /> : ''}
			</Link>
		),
	});

	if (store.authStore.isAuth) {
		menuItems.push({
			key: VECHE_ROUTE,
			label: (
				<Link to={VECHE_ROUTE} className={styles['middle__link']}>
					<PhoneOutlined style={{ marginRight: 8 }} />
					Веча
					{store.vechStore.unreadCount ? <Badge style={{ boxShadow: 'none' }} dot /> : ''}
				</Link>
			),
		});

		menuItems.push({
			key: MAIL_ROUTE,
			label: (
				<Link to={MAIL_ROUTE} className={styles['middle__link']}>
					<MailOutlined style={{ marginRight: 8 }} />
					Сообщения
				</Link>
			),
		});

		menuItems.push({
			key: PERSONALE_ROUTE,
			label: (
				<Link to={`${PERSONALE_ROUTE}/${store.authStore.user.id}`}>
					<UserOutlined style={{ marginRight: 8 }} />
					Учредитель
				</Link>
			),
		});

		// menuItems.push({
		// 	key: MESSAGES_ROUTE,
		// 	className: styles["middle__link"],
		// 	label: (
		// 		<Link to={`${MESSAGES_ROUTE}/personal`} className={styles["middle__link"]}>
		// 			- Личные
		// 			{!allCountAreZero ? <Badge style={{ boxShadow: 'none' }} dot></Badge> : ''}
		// 		</Link>
		// 	),
		// });

		// menuItems.push({
		// 	key: MESSAGES_ROUTE,
		// 	label: (
		// 		<Link to={`${MESSAGES_ROUTE}/locality`} className={styles["middle__link"]}>
		// 			- Общие
		// 			{!allCountAreZero ? <Badge style={{ boxShadow: 'none' }} dot></Badge> : ''}
		// 		</Link>
		// 	),
		// });

		menuItems.push({
			key: EXIT_ROUTE,
			label: (
				<Link to={EXIT_ROUTE} className="middle__link">
					<LogoutOutlined style={{ marginRight: 8 }} />
					Выйти
				</Link>
			),
		});
	}

	// const items = [
	// {
	//     key: MAIL_ROUTE,
	//     label: (
	//         <Link to={MAIL_ROUTE} className="middle__link">
	//             Почта
	//             {/* {!allCountAreZero ? (
	//                 <Badge style={{ boxShadow: "none" }} dot></Badge>
	//             ) : (
	//                 ""
	//             )} */}
	//         </Link>
	//     ),
	// },
	// {
	//     key: GROUP_ROUTE,
	//     label: (
	//         <Link
	//             to={`${GROUP_ROUTE}/locality`}
	//             className="middle__link"
	//         >
	//             Десятки
	//             {/* {!allCountAreZero ? (
	//                 <Badge style={{ boxShadow: "none" }} dot></Badge>
	//             ) : (
	//                 ""
	//             )} */}
	//         </Link>
	//     ),
	// },
	// ];

	useEffect(() => {
		if (currentWidth && currentWidth > 830) setIsCollapse(false);
		else setIsCollapse(true);
	}, [currentWidth]);

	return (
		<nav className="middle__menu">
			<input id="menu-toggle" type="checkbox" onClick={() => setIsCollapse((prev) => !prev)} />
			<label className="menu-button-container" htmlFor="menu-toggle">
				<div className="menu-button"></div>
			</label>

			{!isCollapse && (
				<Menu
					className={styles['selected-menu-item']}
					style={{
						background: currentWidth && currentWidth > 830 ? 'none' : '',
						fontFamily: 'IzhitsaRegular',
						fontSize: 16,
						position: currentWidth && currentWidth < 831 ? 'absolute' : 'relative',
						top: currentWidth && currentWidth < 831 ? 0 : 0,
						marginTop: currentWidth && currentWidth < 831 ? 30 : 0,
						left: 0,
					}}
					selectedKeys={[item]}
					items={menuItems}
				/>
			)}
		</nav>
	);
};

export default observer(NavMiddle);
