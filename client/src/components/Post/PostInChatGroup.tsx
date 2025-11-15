import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_URL, FOUL_MESSAGES, GROUP, MESSAGES, PERSONALE_ROUTE } from '../../utils/consts';

import { Button, message, Carousel, Image, Modal } from 'antd';

import { Buffer } from 'buffer';

import AdminService from '../../services/AdminService';
import { useStoreContext } from '../../contexts/StoreContext';
import FoulModal from '../../pages/Messages/FoulModal/FoulModal';

import styles from './Post.module.css';
import ExpandableText from '../ExpandableText/ExpandableText';
import { observer } from 'mobx-react-lite';
import { SendOutlined } from '@ant-design/icons';
import CustomAvatar from '../CustomAvatar';
// import { PublicationWithPartialUser } from '../../pages/Publications/Publications';
import { PostVideoAttachment, PostVideoModalContent } from './PostVideo';
import { parseIsUrlProtocol } from '../../utils/function';
import PostActions from './PostActions';
import { DeleteGroupMessageDto, UpdateGroupMessageDto } from '../../services/GroupsService';
import TextArea from 'antd/es/input/TextArea';
import { MessageWithPartialUser } from '../../models/IMessages';

interface PostProps {
	post: MessageWithPartialUser;
	deletePost: (id: number, location: string) => void;
}

const PostInChatGroup: React.FC<PostProps> = ({ post, deletePost }) => {
	const [selectedMessage, setSelectedMessage] = useState<MessageWithPartialUser>();
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

	const options_time: {} = {
		timezone: 'UTC',
		hour: 'numeric',
		minute: 'numeric',
	};

	const getLocationOfPathname = (path: string | undefined) => {
		switch (path) {
			case 'locality':
				return 'locality';
			case 'region':
				return 'region';
			case 'country':
				return 'country';
			case 'world':
				return 'world';
			default:
				return null;
		}
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

	const sendFoul = async (selectedRules: number[], selectedActionWithFoul: number, selectedPunishment: number) => {
		if (selectedMessage) {
			try {
				const sendFoulMessage = await AdminService.reportViolation({
					id_cleaner: store.authStore.user.id,
					id_foul_message: selectedMessage.id,
					selectedRules: selectedRules,
					selectedActionWithFoul: selectedActionWithFoul,
					selectedPunishment: selectedPunishment,
					source: GROUP,
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

	const sendEditedMessage = async () => {
		if (!editedText.trim()) return;
		await handleEditMessage(editedText.trim());
		setIsEditing(false);
	};

	const handleEditMessage = async (updatedText: string) => {
		if (!selectedMessage) return;

		try {
			const dto: UpdateGroupMessageDto = {
				id_message: selectedMessage.id,
				message: updatedText,
			};
			const result = await store.groupStore.editMessage(dto);

			if (result.data) {
				message.success('Сообщение обновлено');
				selectedMessage.message = updatedText;
			} else if (result.error) {
				message.error(result.error);
			}
		} catch {
			message.error('Ошибка при редактировании сообщения');
		}
	};

	const handleDeleteMessage = async () => {
		if (!selectedMessage) return;

		try {
			const dto: DeleteGroupMessageDto = {
				id_message: selectedMessage.id,
			};

			const result = await store.groupStore.deleteMessage(dto);

			if (result.data) {
				const location = getLocationOfPathname(parts.at(-1));
				if (!location) return;
				message.success('Сообщение удалено');
				deletePost(selectedMessage.id, location);
			} else if (result.error) {
				message.error(result.error);
			}
		} catch {
			message.error('Ошибка при удалении сообщения');
		}
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
								: `${API_URL}/files/${post.user.photo_50}`
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
				<PostActions
					isActive={isActive}
					visible={visible}
					handleMenuClick={handleMenuClick}
					handleVisibleChange={handleVisibleChange}
					setSelectedMessage={setSelectedMessage}
					post={post}
					handleDeletePost={handleDeleteMessage}
					userId={selectedMessage?.user.id}
					source={MESSAGES}
					message={selectedMessage?.message}
				/>
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
							icon={<SendOutlined style={{ fontSize: '30px', paddingLeft: '15px' }} />}
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

export default observer(PostInChatGroup);
