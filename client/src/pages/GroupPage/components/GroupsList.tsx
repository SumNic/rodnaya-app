import React, { useEffect, useState } from 'react';
import { Groups } from '../GroupPage';

import styles from '../GroupPage.module.css';
import { Spin } from 'antd';
import { IGroup } from '../../../models/response/IGroup';
import { useStoreContext } from '../../../contexts/StoreContext';
import { GROUPS } from '../../../utils/consts';
import AboutGroup from './AboutGroup';
import { observer } from 'mobx-react-lite';
import Group from './Group';
import ChatGroup from './ChatGroup';

interface GroupsListProps {
	groups: Groups;
	location: string;
	isLoadingGroup: boolean;
	isMyGroups: boolean;
}

const GroupsList: React.FC<GroupsListProps> = ({ groups, location, isLoadingGroup, isMyGroups }) => {
	const [filteredGroups, setFilteredGroups] = useState<IGroup[]>([]);

	const { store } = useStoreContext();
	const { user } = store.authStore;
	const {
		isAboutGroupVisible,
		isChatGroupVisible,
		setIsChatGroupVisible,
		aboutGroup,
		source,
		setSource,
		groupForChat,
	} = store.groupStore;

	let locationKey: keyof Groups = location as keyof Groups;

	const groupsFromLocation = groups[locationKey];

	useEffect(() => {
		if (!groupForChat[location]) setIsChatGroupVisible(location, false);
	}, [location, groupForChat]);

	useEffect(() => {
		if (!source[location]) setSource(location, GROUPS);
		if (isMyGroups) return setFilteredGroups(groupsFromLocation.filter((g) => g.users.find((u) => u.id === user.id)));
		setFilteredGroups(groupsFromLocation);
	}, [isMyGroups, locationKey, groupsFromLocation]);

	return (
		<div className={styles.group_wrapper}>
			<Spin spinning={isLoadingGroup}>
				<div className={styles.group}>
					{!isAboutGroupVisible.get(location) &&
						!isChatGroupVisible[location] &&
						filteredGroups?.map((group) => <Group key={group.id} group={group} location={location} />)}
					{isAboutGroupVisible.get(location) && !isChatGroupVisible[location] && aboutGroup[location] && (
						<AboutGroup group={aboutGroup[location]} location={location} />
					)}
					{isChatGroupVisible[location] && groupForChat[location] && (
						<ChatGroup group={groupForChat[location]} location={location} />
					)}
				</div>
			</Spin>
		</div>
	);
};

export default observer(GroupsList);
