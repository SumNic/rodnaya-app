import { observer } from 'mobx-react-lite';
import NavMiddle from '../../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile';
import NavRegions from '../../components/Nav_header/NavRegions';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStoreContext } from '../../contexts/StoreContext';
import HeaderLogoPc from '../../components/HeaderLogo/HeaderLogoPc';
import { HOME_ROUTE, GROUP_ROUTE, LOCAL_STORAGE_IS_MY_GROUPS, CHAT, GROUPS } from '../../utils/consts';
import { Alert, Button, Modal, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GroupModal from './components/GroupModal';

import styles from './GroupPage.module.css';
import GroupsList from './components/GroupsList';
// import { IGroup } from '../../models/response/IGroup';
import Messages from '../Messages/components/Messages';
import { Group } from '../../services/GroupsService';

const { Text } = Typography;

export interface IGroups {
	locality: Group[];
	region: Group[];
	country: Group[];
	world: Group[];
}

const initialGroups: IGroups = {
	locality: [],
	region: [],
	country: [],
	world: [],
};

const GroupPage: React.FC = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [groups, setGroups] = useState<IGroups>(initialGroups);
	const [isCreateGroupModal, setIsCreateGroupModal] = useState(false);
	const [isLoadingGroup, setIsLoadingGroup] = useState(false);
	const [isMyGroups, setIsMyGroups] = useState<boolean>(() => {
		// Получаем значение из localStorage
		const savedValue = localStorage.getItem(LOCAL_STORAGE_IS_MY_GROUPS);
		// Если значение есть, преобразуем его в boolean, иначе используем false
		return savedValue ? JSON.parse(savedValue) : false;
	});
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

	const navigate = useNavigate();

	const { store } = useStoreContext();
	const { getAllGroup, isChangeGroups } = store.groupStore;
	const { isAboutGroupVisible, isChatGroupVisible, groupForChat } = store.groupStore;

	const params = useParams();

	const location: string | undefined = params.location;

	let locationKey: keyof IGroups = location as keyof IGroups;

	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_IS_MY_GROUPS, JSON.stringify(isMyGroups));
	}, [isMyGroups]);

	useEffect(() => {
		if (!store.authStore.isAuth) {
			setIsAuthModalOpen(true);
		}
	}, [store.authStore.isAuth]);

	const nameLocal = useMemo(() => {
		if (!store.authStore.isAuth) return;
		let name = '';
		switch (location) {
			case 'locality':
				name = store.authStore.user.residency.locality || '';
				break;
			case 'region':
				name = store.authStore.user.residency.region || '';
				break;
			case 'country':
				name = store.authStore.user.residency.country || '';
				break;
			case 'world':
				name = 'Земля';
				break;
			default:
				setModalOpen(true);
				break;
		}
		return name;
	}, [location]);

	const handleCreateGroup = (newGroup: IGroups) => {
		setGroups((prev) => ({ ...prev, [locationKey]: [...prev[locationKey], newGroup] }));
	};

	useEffect(() => {
		if (store.authStore.isAuth && location) getGroups(location);
	}, [location, isChangeGroups]);

	const getGroups = async (location: string) => {
		try {
			setIsLoadingGroup(true);
			const allGroups = await getAllGroup(location);
			if (allGroups.data && allGroups.data.length > 0) {
				setGroups((prev) => ({ ...prev, [locationKey]: allGroups.data }));
			}
			setIsLoadingGroup(false);
		} catch (err) {
			setIsLoadingGroup(false);
			console.error(`Ошибка в getGroups: ${err}`);
		}
	};

	useEffect(() => {}, [groups, isMyGroups]);

	return (
		<div>
			<header className="header">
				<div className="header__wrapper">
					<HeaderLogoPc />
					<HeaderLogoMobile />
					{location && <NavRegions location={location} source={GROUPS} route={GROUP_ROUTE} />}
				</div>
			</header>
			<div className="middle">
				<div className="middle__wrapper">
					<NavMiddle item={GROUP_ROUTE} />
					<div className="main__screen main__screen_home logotip-background">
						<div className="name">
							<h2 className="name__local" id="name">
								{nameLocal}
							</h2>
						</div>
						<div style={{ height: '50px' }}></div>
						{store.authStore.isAuth &&
							location &&
							!isAboutGroupVisible.get(location) &&
							!isChatGroupVisible[location] && (
								<div className={styles.buttonsGroup}>
									<Button
										onClick={() => setIsCreateGroupModal(true)}
										style={{ width: '100%', marginTop: 8 }}
										icon={<PlusOutlined />}
									>
										Создать
									</Button>
									<Button onClick={() => setIsMyGroups((prev) => !prev)} style={{ width: '100%', marginTop: 8 }}>
										{isMyGroups ? 'Все группы' : 'Мои группы'}
									</Button>
								</div>
							)}

						{store.authStore.isAuth && location && (
							<GroupsList groups={groups} location={location} isLoadingGroup={isLoadingGroup} isMyGroups={isMyGroups} />
						)}
						{store.authStore.isAuth && location && isChatGroupVisible[location] && (
							<Messages location={location} source={CHAT} group={groupForChat[location]} />
						)}
					</div>
				</div>
			</div>
			<GroupModal
				visible={isCreateGroupModal}
				onCancel={() => setIsCreateGroupModal(false)}
				onCreate={handleCreateGroup}
				location={location}
			/>
			<Modal open={modalOpen} onOk={() => navigate(HOME_ROUTE)} onCancel={() => setModalOpen(false)} width={400}>
				<Text>Страница не существует. Вернуться на главную?</Text>
			</Modal>
			<Modal
				open={isAuthModalOpen}
				title="Ошибка"
				okText="Да"
				cancelText="Нет"
				onOk={() => navigate(HOME_ROUTE)}
				onCancel={() => setIsAuthModalOpen(false)}
				width={400}
				centered
			>
				<Alert
					type="error"
					description="Страница доступна только для авторизованных пользователей. Вернуться на главную?"
				/>
			</Modal>
		</div>
	);
};

export default observer(GroupPage);
