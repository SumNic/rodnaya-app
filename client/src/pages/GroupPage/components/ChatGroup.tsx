import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';

import styles from '../GroupPage.module.css';
import { IGroup } from '../../../models/response/IGroup';
import CustomAvatar from '../../../components/CustomAvatar';
import { Button, Dropdown, MenuProps } from 'antd';
import { CloseOutlined, EllipsisOutlined, LogoutOutlined } from '@ant-design/icons';
import { CHAT, GO_OUT } from '../../../utils/consts';
import { useStoreContext } from '../../../contexts/StoreContext';

interface ChatGroupProps {
	group: IGroup;
	location: string;
}

const ChatGroup: React.FC<ChatGroupProps> = ({ group, location }) => {
	const [visible, setVisible] = useState(false);

	const { store } = useStoreContext();
	const { setIsChatGroupVisible, setIsAboutGroupVisible, setAboutGroup, setSource, leaveTheGroup } = store.groupStore;

	const handleGroupClick = (group: IGroup) => {
		setAboutGroup(location, group);
		setIsAboutGroupVisible(location, true);
		setIsChatGroupVisible(location, false);
		setSource(location, CHAT);
	};

	const options: MenuProps['items'] = [
		{
			key: GO_OUT,
			label: (
				<div className={`${styles.label} ${styles.danger}`} onClick={() => leaveTheGroup(location, group.id)}>
					<LogoutOutlined width="23px" style={{ color: 'red' }} /> {GO_OUT}
				</div>
			),
		},
	];

	const handleSelect = (event: any): void => {
		console.log(event, 'event');
		// if (event === FOUL_MESSAGES) {
		// 	setIsFoulModalOpenOk(true);
		// }
	};

	const handleVisibleChange = (flag: boolean) => {
		setVisible(flag);
	};

	function getParticipantsWord(count: number): string {
		if (count % 10 === 1 && count % 100 !== 11) {
			return `${count} участник`;
		} else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
			return `${count} участника`;
		} else {
			return `${count} участников`;
		}
	}

	return (
		<div>
			<div className={styles.chatHeaderWrapper} key={group.id}>
				<Button type="text" icon={<CloseOutlined />} onClick={() => setIsChatGroupVisible(location, false)} />
				<div style={{ width: '100%', paddingRight: '10px' }}>
					<div onClick={() => handleGroupClick(group)} style={{ cursor: 'pointer' }}>
						<CustomAvatar photoUrl={group.avatar} size={35} names={[group.name]} />
					</div>
					<div className={styles.groupNameBlock}>
						<div onClick={() => handleGroupClick(group)} className={styles.groupChatName} style={{ cursor: 'pointer' }}>
							{group.name}
						</div>

						{/* TODO пока убрать */}
						{/* <div className={styles.menuGroup}>
							<Dropdown
								menu={{ items: options, onClick: handleSelect }}
								onOpenChange={handleVisibleChange}
								open={visible}
								trigger={['click']}
							>
								<Button type="text" className={styles.menuButton}>
									<EllipsisOutlined />
								</Button>
							</Dropdown>
						</div> */}
					</div>
					<div
						onClick={() => handleGroupClick(group)}
						className="mes_message"
						style={{ cursor: 'pointer', fontSize: '15px' }}
					>
						{getParticipantsWord(group.users.length)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default observer(ChatGroup);
