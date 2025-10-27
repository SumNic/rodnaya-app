import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';

import styles from '../GroupPage.module.css';
import ExpandableText from '../../../components/ExpandableText/ExpandableText';
import { CloseOutlined, EditOutlined, EnvironmentOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { IGroup } from '../../../models/response/IGroup';
import CustomAvatar from '../../../components/CustomAvatar';
import { useStoreContext } from '../../../contexts/StoreContext';
import FoundersList from '../../../components/FoundersList';
import { CHAT } from '../../../utils/consts';
import { deepCopy } from 'deep-copy-ts';

interface AboutGroupProps {
	group: IGroup;
	location: string;
}

const AboutGroup: React.FC<AboutGroupProps> = ({ group, location }) => {
	const [isMemberOfGroup, setIsMemberOfGroup] = useState(false);
	const [isCreatorGroup, setIsCreatorGroup] = useState(false);

	const { store } = useStoreContext();
	const { user, setUser } = store.authStore;
	const {
		setIsAboutGroupVisible,
		setAboutGroup,
		source,
		setSource,
		setIsChatGroupVisible,
		joinTheGroup,
		leaveTheGroup,
		setGroupForChat,
	} = store.groupStore;

	const query = [group.country, group.region, group.locality].filter(Boolean).join(', ');
	const yandexMapsUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(query)}`;

	useEffect(() => {
		setIsMemberOfGroup(!!user?.userGroups?.find((g) => g.id === group.id));
		setIsCreatorGroup(group.userId === user.id);
	}, [group, user]);

	const handleCloseAboutButton = () => {
		if (source[location] === CHAT) {
			setIsChatGroupVisible(location, true);
			setSource(location, '');
		}
		setIsAboutGroupVisible(location, false);
		setAboutGroup(location, undefined);
	};

	return (
		<>
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<div className={styles.wrapper}>
					<div style={{ padding: '30px' }}>
						<CustomAvatar photoUrl={group.avatar} size={140} names={[group.name]} />
					</div>
					<div className={styles.personale_wrapper} style={{ paddingBottom: 0 }}>
						<div className={styles['name__first']}>{group.name}</div>
						<div className={styles.p_style}>
							<ExpandableText text={group.task.trim()} />
						</div>
						<div className={styles.residency}>
							<a href={yandexMapsUrl} target="_blank" rel="noopener noreferrer" title="Открыть в Яндекс.Картах">
								<EnvironmentOutlined />
							</a>
							<p className={styles.p_style}>{query}</p>
						</div>

						<div className={styles.buttonsPublications}>
							<Button
								onClick={
									isMemberOfGroup
										? async () => {
												await leaveTheGroup(group.id);

												const copyUser = deepCopy(user);
												setUser({
													...copyUser,
													userGroups: [...copyUser?.userGroups.filter((g) => g.id !== group.id)],
												});
												setIsChatGroupVisible(location, false);
												setIsAboutGroupVisible(location, false);
											}
										: async () => {
												await joinTheGroup(group.id);

												const copyUser = deepCopy(user);
												setUser({ ...copyUser, userGroups: [...copyUser?.userGroups, group] });
												setIsChatGroupVisible(location, true);
												setIsAboutGroupVisible(location, false);
												setGroupForChat(location, group);
											}
								}
								className={styles.button}
								icon={isMemberOfGroup ? <LogoutOutlined /> : <LoginOutlined />}
							>
								{isMemberOfGroup ? 'Выйти' : 'Вступить'}
							</Button>
							{isCreatorGroup && (
								<Button
									// onClick={openVkProfile}
									className={styles.button}
									icon={<EditOutlined />}
								>
									{'Редактировать'}
								</Button>
							)}
						</div>
					</div>
					<Button
						type="text"
						icon={<CloseOutlined />}
						onClick={handleCloseAboutButton}
						style={{
							position: 'absolute',
							top: '20px',
							left: '20px',
							zIndex: 1,
						}}
					/>
				</div>
			</div>
			<div className={styles.buttonsPublications}>
				<Button className={styles.button}>{'Участники'}</Button>
			</div>
			<FoundersList founders={group.users} />
		</>
	);
};

export default observer(AboutGroup);
