import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
	API_URL,
	DELETE_MESSAGES,
	EDIT_MESSAGES,
	FOUL_MESSAGES,
	GO,
	GROUP,
	HOST,
	MESSAGES,
	MESSAGES_ROUTE,
	PERSONALE_ROUTE,
	PUBLICATION_ID_ROUTE,
	PUBLICATIONS,
	SHARE,
} from '../../utils/consts';

import { Button, Dropdown, MenuProps, message, Carousel, Image, Modal } from 'antd';

import { Buffer } from 'buffer';

import AdminService from '../../services/AdminService';
import { useStoreContext } from '../../contexts/StoreContext';
import FoulModal from '../../pages/Messages/FoulModal/FoulModal';

import styles from './Post.module.css';
import ExpandableText from '../ExpandableText/ExpandableText';
import { DangerIcon } from '../../UI/icons/DangerIcon';
import { observer } from 'mobx-react-lite';
import { DeleteOutlined, EditOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons';
import ShareButton from '../ShareButton';
import CustomAvatar from '../CustomAvatar';
import { PublicationWithPartialUser } from '../../pages/Publications/Publications';
import { PostVideoAttachment, PostVideoModalContent } from './PostVideo';
import { parseIsUrlProtocol } from '../../utils/function';
import { DeletePublicationDto, UpdatePublicationDto } from '../../services/PublicationsService';
import TextArea from 'antd/es/input/TextArea';

interface PostProps {
	post: PublicationWithPartialUser;
	deletePublication?: (id: number) => void;
}

const PostForPublication: React.FC<PostProps> = ({ post, deletePublication }) => {
	const [selectedMessage, setSelectedMessage] = useState<PublicationWithPartialUser>();
	const [isFoulModalOpenOk, setIsFoulModalOpenOk] = useState(false);
	const [visible, setVisible] = useState(false);
	const [isActive, setIsActive] = useState(false);
	const [width, setWidth] = useState<number>(0);
	const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
	const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editedText, setEditedText] = useState(post.message);

	const divRef = useRef<HTMLDivElement>(null);

	const { store } = useStoreContext();

	const location = useLocation();
	const path = location.pathname;

	const parts = path.split('/');

	var options_time: {} = {
		timezone: 'UTC',
		hour: 'numeric',
		minute: 'numeric',
	};

	useEffect(() => {
		if (divRef.current) {
			setWidth(divRef.current.offsetWidth);
		}

		// обновляем при изменении размера окна
		const handleResize = () => {
			if (divRef.current) {
				setWidth(divRef.current.offsetWidth);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const splitRoute = MESSAGES_ROUTE.split('/');

	const url = `${HOST}/${PUBLICATION_ID_ROUTE}/${post.id}`;

	const sourceFoul = () => {
		if (parts.includes(MESSAGES)) return MESSAGES;
		if (parts.includes(PUBLICATIONS)) return PUBLICATIONS;
		if (parts.includes(GROUP)) return GROUP;
		return '';
	};

	const sendFoul = async (selectedRules: number[], selectedActionWithFoul: number, selectedPunishment: number) => {
		if (selectedMessage) {
			try {
				const sendFoulMessage = await AdminService.reportViolation({
					id_cleaner: store.authStore.user.id,
					id_foul_message: selectedMessage.id,
					selectedRules: selectedRules,
					selectedActionWithFoul: selectedActionWithFoul,
					selectedPunishment: selectedPunishment,
					source: sourceFoul(),
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
		} else if (event === EDIT_MESSAGES) {
			startEditing();
		}
	};

	const startEditing = () => {
		setIsEditing(true);
		setEditedText(selectedMessage?.message || '');
	};

	const handleMenuClick = (e: any) => {
		console.log(e, 'e');

		if (e.key === 'share') {
			return;
		}
		handleSelect(e.key); // Обработка выбора основного пункта меню
	};

	const handleVisibleChange = (flag: boolean) => {
		setVisible(flag);
	};

	const handleEditPublication = async (updatedText: string) => {
		if (!selectedMessage) return;

		try {
			const dto: UpdatePublicationDto = {
				id_message: selectedMessage.id,
				message: updatedText,
			};
			const result = await store.publicationStore.editMessage(dto);

			if (result.data) {
				message.success('Сообщение обновлено');
				selectedMessage.message = updatedText; // обновляем локально
			} else if (result.error) {
				message.error(result.error);
			}
		} catch (err) {
			message.error('Ошибка при редактировании публикации');
			console.error(err);
		}
	};

	const handleDeletePublication = async () => {
		if (!selectedMessage) return;

		try {
			const dto: DeletePublicationDto = {
				id_message: selectedMessage.id,
			};
			const result = await store.publicationStore.deleteMessage(dto);

			if (result.data) {
				message.success('Публикация удалена');
				if (deletePublication) deletePublication(selectedMessage.id);
			} else if (result.error) {
				message.error(result.error);
			}
		} catch (err) {
			message.error('Ошибка при удалении публикации');
			console.error(err);
		}
	};

	const options: MenuProps['items'] = [
		{
			key: EDIT_MESSAGES,
			label: store.authStore.user.id === selectedMessage?.user.id && (
				<div className={`${styles.label}`}>
					<EditOutlined width="23px" /> {EDIT_MESSAGES}
				</div>
			),
		},
		{
			key: DELETE_MESSAGES,
			label: store.authStore.user.id === selectedMessage?.user.id && (
				<div className={`${styles.label}`} onClick={handleDeletePublication}>
					<DeleteOutlined width="23px" /> {DELETE_MESSAGES}
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
					{
						key: GO,
						label: <Link to={`${PUBLICATION_ID_ROUTE}/${post.id}`}>{GO}</Link>,
					},
				]
			: []),
		{
			key: FOUL_MESSAGES,
			label: (
				<div className={`${styles.label} ${styles.danger}`}>
					<DangerIcon width="23px" fill="red" /> {FOUL_MESSAGES}
				</div>
			),
		},
	];

	const sendEditedMessage = async () => {
		if (!editedText.trim()) return;
		await handleEditPublication(editedText.trim());
		setIsEditing(false);
	};

	const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
	const files = post?.files || [];
	const imageFiles = files.filter((file) => {
		const originFileName = Buffer.from(file.fileName, 'latin1').toString('utf8');
		const ext = originFileName.split('.').pop()?.toLowerCase() || '';
		return imageExtensions.includes(ext);
	});
	const otherFiles = files.filter((file) => {
		const originFileName = Buffer.from(file.fileName, 'latin1').toString('utf8');
		const ext = originFileName.split('.').pop()?.toLowerCase() || '';
		return !imageExtensions.includes(ext);
	});

	return (
		<div
			className={`${styles['mes__wrapper']} ${isActive ? styles.active : ''}`}
			onClick={(e) => {
				const target = e.target as HTMLElement;
				if (target.closest('a, button')) return;
				setIsActive((prev) => !prev);
			}}
		>
			<div className={styles.header}>
				<Link to={`${PERSONALE_ROUTE}/${post.user.id}`} className={styles.avatarLink}>
					<CustomAvatar
						photoUrl={
							post.user.photo_50 && parseIsUrlProtocol(post.user.photo_50)
								? post.user.photo_50
								: `${API_URL}/file/${post.user.photo_50}`
						}
						size={40}
						names={[post.user.first_name || '', post.user.last_name || '']}
					/>
				</Link>
				<div className={styles.name__first_last}>
					<div className={styles.nameRow}>
						<Link to={`${PERSONALE_ROUTE}/${post.user.id}`} className={styles.name__first}>
							<p className={styles.name__first}>{post.user.first_name}</p>
						</Link>
						<Link to={`${PERSONALE_ROUTE}/${post.user.id}`} className={styles.name__first}>
							<p className={styles.name__first}>{post.user.last_name}</p>
						</Link>
					</div>
					<p className={styles.name__time}>
						{post.createdAt && new Date(post.createdAt).toLocaleString('ru', options_time)}
					</p>
				</div>
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
			</div>
			<div className={styles.messageBody}>
				{isEditing ? (
					<div className={styles.editContainer}>
						<TextArea
							value={editedText}
							onChange={(e) => setEditedText(e.target.value)}
							autoSize={{ minRows: 2, maxRows: 4 }}
						/>
						<Button
							type="text"
							icon={<SendOutlined style={{ color: '#b1b3b1', fontSize: '30px', paddingLeft: '15px' }} />}
							onClick={sendEditedMessage}
						/>
					</div>
				) : (
					<ExpandableText text={post.message.trim()} />
				)}
			</div>
			{!!otherFiles.length && (
				<div className={styles.filesList}>
					{otherFiles.map((file) => {
						const href = `${API_URL}/file/${file.fileNameUuid}`;
						return (
							<div key={file.id} className={styles.fileItem}>
								<span className={styles.fileBullet} aria-hidden>
									📎
								</span>
								<a href={href} target="_blank" rel="noreferrer" className={styles.fileLinkCompact}>
									{file.fileName}
								</a>
							</div>
						);
					})}
				</div>
			)}
			{(imageFiles.length > 0 || (post.video && post.video.length > 0)) && (
				<div className={styles.attachments} ref={divRef}>
					<Carousel
						dots={imageFiles.length + (post.video?.length || 0) > 1}
						arrows={imageFiles.length + (post.video?.length || 0) > 1}
					>
						{/* Картинки */}
						{imageFiles.map((file) => {
							const href = `${API_URL}/file/${file.fileNameUuid}`;
							return (
								<div key={`img-${file.id}`}>
									<div className={styles.attachmentImage}>
										<Image src={href} alt={file.fileName.slice(0, 30)} height={(width * 9) / 16} />
									</div>
								</div>
							);
						})}

						{/* Видео */}
						{post.video?.map((videoUrl, index) => (
							<div key={`vid-${index}`}>
								<PostVideoAttachment
									videoUrl={videoUrl}
									width={width}
									onOpen={(url) => {
										setSelectedVideo(url);
										setIsVideoModalOpen(true);
									}}
								/>
							</div>
						))}
					</Carousel>
				</div>
			)}

			<FoulModal
				isFoulModalOpenOk={isFoulModalOpenOk}
				sendFoul={sendFoul}
				onCancel={() => setIsFoulModalOpenOk(false)}
			/>
			<Modal
				open={isVideoModalOpen}
				footer={null}
				onCancel={() => {
					setIsVideoModalOpen(false);
					setSelectedVideo(null);
				}}
				centered
				width="80%"
			>
				{selectedVideo && <PostVideoModalContent videoUrl={selectedVideo} />}
			</Modal>
		</div>
	);
};

export default observer(PostForPublication);
