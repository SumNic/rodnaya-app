import { Link } from 'react-router-dom';
import { LocationEnum, MESSAGES_ROUTE } from '../../utils/consts';
import { Badge } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStoreContext } from '../../contexts/StoreContext.ts';
import { useMessageContext } from '../../contexts/MessageContext.ts';

interface Props {
	location: string;
	route: string;
	source: string;
}

const NavRegions: React.FC<Props> = ({location, route, source}) => {
	const { store } = useStoreContext();

	const { messagesContainerRef } = useMessageContext();

	const { arrCountNoReadMessages } = store.messageStore;
	let style1 = {};
	let style2 = {};
	let style3 = {};
	let style4 = {};
	let classN1 = '';
	let classN2 = '';

	if (location === 'locality') {
		style1 = { borderBottom: 'none', borderRadius: '20px 20px 0 0' };
		style2 = { backgroundColor: 'white', borderRadius: '20px 0 0 20px' };
		style3 = { backgroundColor: 'white' };
		style4 = { backgroundColor: 'white' };
	}
	if (location === 'region') {
		style1 = {
			backgroundColor: 'white',
			borderRadius: '20px 20px 20px 0',
			borderRight: '1px solid black',
			zIndex: '0',
		};
		style2 = {
			borderBottom: 'none',
			borderRadius: '20px 20px 0 0',
			borderLeft: 'none',
		};
		style3 = { backgroundColor: 'white', borderRadius: '20px 0 0 20px' };
		style4 = { backgroundColor: 'white' };
	}
	if (location === 'country') {
		style1 = { backgroundColor: 'white' };
		style2 = {
			backgroundColor: 'white',
			borderRadius: '0 20px 20px 0',
			borderRight: '1px solid black',
			zIndex: '0',
		};
		classN1 = 'header__item_second';
		style3 = {
			borderBottom: 'none',
			borderRadius: '20px 20px 0 0',
			borderLeft: 'none',
		};
		style4 = { backgroundColor: 'white', borderRadius: '20px 20px 0 20px' };
	}
	if (location === 'world') {
		style1 = { backgroundColor: 'white' };
		style2 = { backgroundColor: 'white' };
		style3 = {
			backgroundColor: 'white',
			borderRadius: '0 20px 20px 0',
			borderRight: '1px solid black',
			zIndex: '0',
		};
		classN2 = 'header__item_second';
		style4 = {
			borderBottom: 'none',
			borderRadius: '20px 20px 0 0',
			borderLeft: 'none',
		};
	}

	const keys = Object.keys(LocationEnum).filter((v) => isNaN(Number(v)));

	const navMenu = keys.map((elem, index) => (
		<li
			key={index}
			className={
				index === 0
					? 'header__item  header__item_second'
					: index === 1
					? 'header__item ' + classN1
					: index === 2
					? 'header__item ' + classN2
					: 'header__item'
			}
			style={index === 0 ? style1 : index === 1 ? style2 : index === 2 ? style3 : style4}
		>
			<Link
				to={`${route}/${elem}`}
				className="header__link"
				onClick={() => {
					const container = messagesContainerRef.current;
					if (container) {
						localStorage.setItem(`scrollTop-${source}-${location}`, container.scrollTop.toString());
					}
				}}
			>
				{elem === 'locality' && 'Район'}
				{elem === 'region' && 'Регион'}
				{elem === 'country' && 'Страна'}
				{elem === 'world' && 'Мир'}
			</Link>

			{route === MESSAGES_ROUTE && arrCountNoReadMessages && arrCountNoReadMessages[index]?.count > 0 ? (
				<Badge count={arrCountNoReadMessages[index]?.count} style={{ boxShadow: 'none' }}>
					<div style={{ minWidth: 12, minHeight: 15 }}></div>
				</Badge>
			) : (
				''
			)}
		</li>
	));

	return (
		<nav className="header__menu">
			<ul className="header__list">{navMenu}</ul>
		</nav>
	);
}

export default observer(NavRegions);
