import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
	DOMEN,
	FOUL_MESSAGES,
	HOST,
	MESSAGES,
	MESSAGES_ROUTE,
	PERSONALE_ROUTE,
	PUBLICATIONS,
	SHARE,
} from '../../utils/consts';

import { Button, Dropdown, MenuProps, message } from 'antd';

import { Buffer } from 'buffer';

import { IPost } from '../../models/IPost';
import AdminService from '../../services/AdminService';
import { useStoreContext } from '../../contexts/StoreContext';
import FoulModal from '../../pages/Messages/FoulModal/FoulModal';

import styles from './Post.module.css';
import ExpandableText from '../ExpandableText/ExpandableText';
import { DangerIcon } from '../../UI/icons/DangerIcon';
import { observer } from 'mobx-react-lite';
import { EllipsisOutlined } from '@ant-design/icons';
import ShareButton from '../ShareButton';

interface PostProps {
	post: IPost;
}

const Post: React.FC<PostProps> = ({ post }) => {
	const [selectedMessage, setSelectedMessage] = useState<IPost>();
	const [isFoulModalOpenOk, setIsFoulModalOpenOk] = useState(false);
	const [visible, setVisible] = useState(false);

	const { store } = useStoreContext();

	const location = useLocation();
	const path = location.pathname;

	const parts = path.split('/');

	var options_time: {} = {
		timezone: 'UTC',
		hour: 'numeric',
		minute: 'numeric',
	};

	const splitRoute = MESSAGES_ROUTE.split('/');

	const url = `${HOST}/get-publication/${post.id}`;

	const options: MenuProps['items'] = [
		{
			key: FOUL_MESSAGES,
			label: (
				<div className={`${styles.label} ${styles.danger}`}>
					<DangerIcon width="23px" fill="red" /> {FOUL_MESSAGES}
				</div>
			),
		},
		...(!parts.includes(splitRoute[1])
			? [
					{
						key: SHARE,
						title: 'Поделиться',
						label: <>{SHARE}</>,
						children: ['vk', 'telegram', 'whatsapp'].map((platform) => ({
							key: platform,
							label: <ShareButton platform={platform} url={url} text={selectedMessage?.message || ''} />,
						})),
					},
			  ]
			: []),
	];

	const sourceFoul = parts.includes(MESSAGES) ? MESSAGES : PUBLICATIONS;

	const sendFoul = async (selectedRules: number[], selectedActionWithFoul: number, selectedPunishment: number) => {
		if (selectedMessage) {
			try {
				const sendFoulMessage = await AdminService.reportViolation({
					id_cleaner: store.authStore.user.id,
					id_foul_message: selectedMessage.id,
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

	return (
		<div className={styles['mes__wrapper']}>
			<div className="buttons-container"></div>
			<Link to={`${PERSONALE_ROUTE}/${post.user.id}`}>
				<img className="mes_foto" src={post.user.photo_50} />
			</Link>
			<div className="name__first_last">
				<Link to={`${PERSONALE_ROUTE}/${post.user.id}`} className="name__first">
					<p className="name__first">{post.user.first_name}</p>
				</Link>
				<Link to={`${PERSONALE_ROUTE}/${post.user.id}`} className="name__first">
					<p className="name__first">{post.user.last_name}</p>
				</Link>
				<p className="name__time">{new Date(post.createdAt).toLocaleString('ru', options_time)}</p>
				<div className={styles.foul}>
					<Dropdown
						menu={{ items: options, onClick: handleMenuClick }}
						onOpenChange={handleVisibleChange}
						open={visible}
						trigger={['click']}
					>
						<Button type="text" className={styles.menuButton} onClick={() => setSelectedMessage(post)}>
							<EllipsisOutlined />
						</Button>
					</Dropdown>
				</div>
			</div>
			<ExpandableText text={post.message.trim()} />
			<div className="div_name_file">
				{post?.files?.map((file) => {
					let originFileName = Buffer.from(file.fileName, 'latin1').toString('utf8');
					return (
						<Link to={`${DOMEN}/${file.fileNameUuid}`} target="_blank" key={file.id} className="name__file">
							{originFileName}
						</Link>
					);
				})}
			</div>
			<FoulModal
				isFoulModalOpenOk={isFoulModalOpenOk}
				sendFoul={sendFoul}
				onCancel={() => setIsFoulModalOpenOk(false)}
			/>
		</div>
	);
};

export default observer(Post);
