import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
// import { IGroup } from '../../../models/response/IGroup';

import styles from '../GroupPage.module.css';
import CustomAvatar from '../../../components/CustomAvatar';
import { Button, Dropdown, MenuProps, message } from 'antd';
import { useStoreContext } from '../../../contexts/StoreContext';
import { FOUL_MESSAGES, GO, GROUPS, ONE_GROUP_ROUTE } from '../../../utils/consts';
import { DangerIcon } from '../../../UI/icons/DangerIcon';
import { Link } from 'react-router-dom';
import AdminService from '../../../services/AdminService';
import { EllipsisOutlined } from '@ant-design/icons';
import ExpandableText from '../../../components/ExpandableText/ExpandableText';
import FoulModal from '../../Messages/FoulModal/FoulModal';
import { Group } from '../../../services/GroupsService';

interface GroupProps {
	group: Group;
	location: string;
}

const OneGroup: React.FC<GroupProps> = ({ group, location }) => {
	const [selectedGroup, setSelectedGroup] = useState<Group>();
	const [isFoulModalOpenOk, setIsFoulModalOpenOk] = useState(false);
	const [visible, setVisible] = useState(false);

	const { store } = useStoreContext();
	const { user } = store.authStore;
	const { setIsAboutGroupVisible, setIsChatGroupVisible, setAboutGroup, setGroupForChat } = store.groupStore;

	const handleMenuClick = (e: any) => {
		if (e.key === 'share') {
			// Обработка выбора подменю "Поделиться"
			return;
		}
		handleSelect(e.key); // Обработка выбора основного пункта меню
	};

	const handleVisibleChange = (flag: boolean) => {
		setVisible(flag);
	};

	const handleGroupClick = (group: Group) => {
		if (group.users.find((u) => u.id === user.id)) {
			setGroupForChat(location, group);
			setIsChatGroupVisible(location, true);
		} else {
			setAboutGroup(location, group);
			setIsAboutGroupVisible(location, true);
		}
	};

	const options: MenuProps['items'] = [
		{
			key: FOUL_MESSAGES,
			label: (
				<div className={`${styles.label} ${styles.danger}`}>
					<DangerIcon width="23px" fill="red" /> {FOUL_MESSAGES}
				</div>
			),
		},
		{
			key: GO,
			label: <Link to={`${ONE_GROUP_ROUTE}/${selectedGroup?.id}`}>{GO}</Link>,
		},
	];

	const sourceFoul = GROUPS;

	const sendFoul = async (selectedRules: number[], selectedActionWithFoul: number, selectedPunishment: number) => {
		if (selectedGroup) {
			try {
				const sendFoulMessage = await AdminService.reportViolation({
					id_cleaner: user.id,
					id_foul_message: selectedGroup.id,
					selectedRules: selectedRules,
					selectedActionWithFoul: selectedActionWithFoul,
					selectedPunishment: selectedPunishment,
					source: sourceFoul,
				});

				if (sendFoulMessage) message.success(`${sendFoulMessage.data}`);
			} catch (err) {
				console.error(`Ошибка в sendFoul: ${err}`);
			}
		}
	};

	const handleSelect = (event: string): void => {
		if (event === FOUL_MESSAGES) {
			setIsFoulModalOpenOk(true);
		}
	};

	return (
		<>
			<div className={styles['mes__wrapper']}>
				<div onClick={() => handleGroupClick(group)} style={{ cursor: 'pointer' }}>
					<CustomAvatar photoUrl={group.avatar} size={40} names={[group.name]} />
				</div>
				<div className={styles.groupNameBlock}>
					<div onClick={() => handleGroupClick(group)} className={styles.groupName} style={{ cursor: 'pointer' }}>
						{group.name}
					</div>

					<div className={styles.foul}>
						<Dropdown
							menu={{ items: options, onClick: handleMenuClick }}
							onOpenChange={handleVisibleChange}
							open={visible}
							trigger={['click']}
						>
							<Button type="text" className={styles.menuButton} onClick={() => setSelectedGroup(group)}>
								<EllipsisOutlined />
							</Button>
						</Dropdown>
					</div>
				</div>
				<div onClick={() => handleGroupClick(group)} className="mes_message" style={{ cursor: 'pointer' }}>
					<ExpandableText text={group.task.trim()} />
				</div>
				<FoulModal
					isFoulModalOpenOk={isFoulModalOpenOk}
					sendFoul={sendFoul}
					onCancel={() => setIsFoulModalOpenOk(false)}
				/>
			</div>
		</>
	);
};

export default observer(OneGroup);
