import React from 'react';
import { Button, Dropdown, MenuProps } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './Post.module.css';
import { useStoreContext } from '../../contexts/StoreContext';
import { Link } from 'react-router-dom';
import { DangerIcon } from '../../UI/icons/DangerIcon';
import {
	EDIT_MESSAGES,
	DELETE_MESSAGES,
	SHARE,
	GO,
	PUBLICATION_ID_ROUTE,
	FOUL_MESSAGES,
	PUBLICATIONS,
	HOST,
} from '../../utils/consts';
import ShareButton from '../ShareButton';
import { PublicationWithPartialUser } from '../../pages/Publications/Publications';
import { MessageWithPartialUser } from '../../models/IMessages';

interface PostActionsProps {
	isActive: boolean;
	visible: boolean;
	handleMenuClick: (e: any) => void;
	handleVisibleChange: (open: boolean) => void;
	setSelectedMessage: (v: any) => void;
	handleDeletePost: () => void;
	post: PublicationWithPartialUser | MessageWithPartialUser; // тип публикации
	userId: number | undefined;
	source: string;
	message: string | undefined;
}

const PostActions: React.FC<PostActionsProps> = ({
	isActive,
	visible,
	handleMenuClick,
	handleVisibleChange,
	setSelectedMessage,
	post,
	handleDeletePost,
	userId,
	source,
	message,
}) => {
	const { store } = useStoreContext();

	const url = `${HOST}/${PUBLICATION_ID_ROUTE}/${post.id}`;

	const options: MenuProps['items'] = [
		...(store.authStore.user.id !== userId
			? [
					{
						key: FOUL_MESSAGES,
						label: (
							<div className={`${styles.label} ${styles.danger}`}>
								<DangerIcon width="23px" fill="red" /> {FOUL_MESSAGES}
							</div>
						),
					},
				]
			: [
					{
						key: EDIT_MESSAGES,
						label: (
							<div className={`${styles.label}`}>
								<EditOutlined width="23px" /> {EDIT_MESSAGES}
							</div>
						),
					},
					{
						key: DELETE_MESSAGES,
						label: store.authStore.user.id === userId && (
							<div className={`${styles.label}`} onClick={handleDeletePost}>
								<DeleteOutlined width="23px" /> {DELETE_MESSAGES}
							</div>
						),
					},
				]),

		...(source === PUBLICATIONS
			? [
					{
						key: SHARE,
						title: 'Поделиться',
						label: source === PUBLICATIONS && SHARE,
						children: ['vk', 'telegram', 'whatsapp'].map((platform) => ({
							key: platform,
							label: <ShareButton platform={platform} url={url} text={message || ''} />,
						})),
					},
					{
						key: GO,
						label: source === PUBLICATIONS && <Link to={`${PUBLICATION_ID_ROUTE}/${post.id}`}>{GO}</Link>,
					},
				]
			: []),
	];

	return (
		<div className={styles.actions}>
			<div className={`${styles.foul} ${isActive ? styles.show : ''}`}>
				<Dropdown
					menu={{ items: options, onClick: handleMenuClick }}
					onOpenChange={handleVisibleChange}
					open={visible}
					trigger={['click']}
				>
					<Button
						type="text"
						shape="circle"
						size="small"
						className={styles.menuButton}
						icon={<PlusOutlined />}
						onClick={(e) => {
							e.stopPropagation();
							setSelectedMessage(post);
						}}
					/>
				</Dropdown>
			</div>
		</div>
	);
};

export default PostActions;
