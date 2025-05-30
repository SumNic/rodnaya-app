import React from 'react';

import { Spin } from 'antd';
import { IGroup } from '../../../models/response/IGroup';

import styles from '../OneGroup.module.css';
import { observer } from 'mobx-react-lite';

interface GroupElementProps {
	group: IGroup;
	isLoadingGroup: boolean;
}

const GroupElement: React.FC<GroupElementProps> = ({ group, isLoadingGroup }) => {
	// const [isUserMemberGroup, setIsUserMemberGroup] = useState(false);

	// const {store} = useStoreContext();
	// const {user} = store.authStore;

	// useEffect(() => {
	// 	if (group.users.find((u) => u.id === user.id)) setIsUserMemberGroup(true)
	// 	else(setIsUserMemberGroup(false))
	// }, [group, user]);

	return (
		<div className={styles.group_wrapper} id="div__messages">
			<Spin spinning={isLoadingGroup}>
				<div className={styles.group}>
					<div key={group.id} id={`${group.id}`}>
						{/* {isUserMemberGroup ? <ChatGroup group={group} /> : <AboutGroup group={group}/> } */}
					</div>
				</div>
			</Spin>
		</div>
	);
};

export default observer(GroupElement);
