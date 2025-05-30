import { observer } from 'mobx-react-lite';
import Footer from '../../components/Footer';
import NavMiddle from '../../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile';
import NavRegions from '../../components/Nav_header/NavRegions';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStoreContext } from '../../contexts/StoreContext';
import HeaderLogoPc from '../../components/HeaderLogo/HeaderLogoPc';
import { HOME_ROUTE, GROUP_ROUTE, LOCAL_STORAGE_IS_MY_GROUPS, CHAT, GROUPS } from '../../utils/consts';
import { Button, Modal, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GroupModal from './components/GroupModal';

import styles from './GroupPage.module.css';
import GroupsList from './components/GroupsList';
import { IGroup } from '../../models/response/IGroup';
import Messages from '../Messages/components/Messages';

const { Text } = Typography;

export interface Groups {
	locality: IGroup[];
	region: IGroup[];
	country: IGroup[];
	world: IGroup[];
}

const initialGroups: Groups = {
	locality: [],
	region: [],
	country: [],
	world: [],
};

const GroupPage: React.FC = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [groups, setGroups] = useState<Groups>(initialGroups);
	const [isCreateGroupModal, setIsCreateGroupModal] = useState(false);
	const [isLoadingGroup, setIsLoadingGroup] = useState(false);
	const [isMyGroups, setIsMyGroups] = useState<boolean>(() => {
		// Получаем значение из localStorage
		const savedValue = localStorage.getItem(LOCAL_STORAGE_IS_MY_GROUPS);
		// Если значение есть, преобразуем его в boolean, иначе используем false
		return savedValue ? JSON.parse(savedValue) : false;
	});

	const navigate = useNavigate();

	const { store } = useStoreContext();
	const { getAllGroup } = store.groupStore;
	const { isAboutGroupVisible, isChatGroupVisible, groupForChat } = store.groupStore;

	const params = useParams();

	const location: string | undefined = params.location;

	let locationKey: keyof Groups = location as keyof Groups;

	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_IS_MY_GROUPS, JSON.stringify(isMyGroups));
	}, [isMyGroups]);

	const nameLocal = useMemo(() => {
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

	const handleCreateGroup = (newGroup: IGroup) => {
		setGroups((prev) => ({ ...prev, [locationKey]: [...prev[locationKey], newGroup] }));
	};

	useEffect(() => {
		if (location) getGroups(location);
	}, [location]);

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
						{location && !isAboutGroupVisible.get(location) && !isChatGroupVisible[location] && (
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

						{location && (
							<GroupsList groups={groups} location={location} isLoadingGroup={isLoadingGroup} isMyGroups={isMyGroups} />
						)}
						{location && isChatGroupVisible[location] && (
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
			{/* <Footer /> */}
		</div>
	);
};

export default observer(GroupPage);
