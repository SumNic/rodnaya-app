import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DOMEN, FOUL_MESSAGES, HOST, MESSAGES, MESSAGES_ROUTE, PERSONALE_ROUTE, PUBLICATIONS, SHARE } from '../../utils/consts';

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

interface PostProps {
	post: IPost;
}

const Post: React.FC<PostProps> = ({ post }) => {
	const [idFoulMessage, setIdFoulMessage] = useState<number>();
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
						children: [
							{
								key: 'vk',
								label: <div onClick={() => handleShare('vk', 'Родная партия')}>ВКонтакте</div>,
							},
							{
								key: 'telegram',
								label: <div onClick={() => handleShare('telegram', 'Родная партия')}>Телеграм</div>,
							},
							{
								key: 'whatsapp',
								label: <div onClick={() => handleShare('whatsapp', 'Родная партия')}>WhatsApp</div>,
							},
						],
					},
			  ]
			: []),
	];

	const sourceFoul = parts.includes(MESSAGES) ? MESSAGES : PUBLICATIONS;

	const sendFoul = async (selectedRules: number[], selectedActionWithFoul: number, selectedPunishment: number) => {
		if (idFoulMessage) {
			try {
				const sendFoulMessage = await AdminService.reportViolation({
					id_cleaner: store.authStore.user.id,
					id_foul_message: idFoulMessage,
					selectedRules: selectedRules,
					selectedActionWithFoul: selectedActionWithFoul,
					selectedPunishment: selectedPunishment,
					source: sourceFoul
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

	const url = `${HOST}/get-publication/${post.id}`;

	const handleShare = (platform: string, text: string) => {
		const shareUrl = encodeURIComponent(url);
		const shareText = encodeURIComponent(text);

		let shareLink = '';
		if (platform === 'vk') {
			shareLink = `https://vk.com/share.php?url=${shareUrl}&title=${shareText}`;
		} else if (platform === 'telegram') {
			shareLink = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;
		} else if (platform === 'whatsapp') {
			shareLink = `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`;
		}

		if (shareLink) {
			window.open(
				shareLink,
				'popupWindow',
				'width=600,height=500,left=100,top=100,resizable=no,scrollbars=no,status=no'
			);
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
					<Button type="text" className={styles.menuButton} onClick={() => setIdFoulMessage(post.id)}>
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
