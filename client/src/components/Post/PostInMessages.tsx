import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { API_URL, EDIT_MESSAGES, FOUL_MESSAGES, MESSAGES, PERSONALE_ROUTE } from '../../utils/consts';

import { message, Carousel, Image, Modal } from 'antd';

import { Buffer } from 'buffer';

import AdminService from '../../services/AdminService';
import { useStoreContext } from '../../contexts/StoreContext';
import FoulModal from '../../pages/Messages/FoulModal/FoulModal';

import styles from './Post.module.css';
import ExpandableText from '../ExpandableText/ExpandableText';
import { observer } from 'mobx-react-lite';
import CustomAvatar from '../CustomAvatar';
import { PostVideoAttachment, PostVideoModalContent } from './PostVideo';
import { MessageWithPartialUser } from '../../models/IMessages';
import { DeleteMessageDto, UpdateMessageDto } from '../../services/MessagesService';
import { parseIsUrlProtocol } from '../../utils/function';

import PostActions from './PostActions';
import EditingPost from './EditingPost';

interface PostProps {
	post: MessageWithPartialUser;
	deletePost: (id: number, location: string) => void;
}

const PostInMessages: React.FC<PostProps> = ({ post, deletePost }) => {
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
					selectedRules,
					selectedActionWithFoul,
					selectedPunishment,
					source: MESSAGES,
				});

				if (sendFoulMessage) message.success(`${sendFoulMessage.data}`);
			} catch (err) {
				console.error(`Ошибка в sendFoul: ${err}`);
			}
		}
	};

	const startEditing = () => {
		setIsEditing(true);
		setEditedText(selectedMessage?.message || '');
	};

	const handleSelect = (event: string): void => {
		if (event === FOUL_MESSAGES) {
			setIsFoulModalOpenOk(true);
		} else if (event === EDIT_MESSAGES) {
			startEditing();
		}
	};

	const handleMenuClick = (e: any) => {
		if (e.key === 'share') return;
		handleSelect(e.key);
	};

	const handleVisibleChange = (flag: boolean) => {
		setVisible(flag);
	};

	const handleEditMessage = async (updatedText: string) => {
		if (!selectedMessage) return;

		try {
			const dto: UpdateMessageDto = {
				id_message: selectedMessage.id,
				message: updatedText,
			};
			const result = await store.messageStore.editMessage(dto);

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
			const dto: DeleteMessageDto = {
				id_message: selectedMessage.id,
			};

			const result = await store.messageStore.deleteMessage(dto);

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
		const name = Buffer.from(file.fileName, 'latin1').toString('utf8');
		const ext = name.split('.').pop()?.toLowerCase() || '';
		return imageExtensions.includes(ext);
	});
	const otherFiles = files.filter((file) => {
		const name = Buffer.from(file.fileName, 'latin1').toString('utf8');
		const ext = name.split('.').pop()?.toLowerCase() || '';
		return !imageExtensions.includes(ext);
	});

	return (
		<div
			className={`${styles['mes__wrapper']} ${isActive ? styles.active : ''}`}
			onClick={(e) => {
				if ((e.target as HTMLElement).closest('a, button')) return;
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

				{/* ⬇⬇⬇ NEW COMPONENT HERE ⬇⬇⬇ */}
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
					<EditingPost
						editedText={editedText}
						setEditedText={setEditedText}
						setIsEditing={setIsEditing}
						handleEditPost={handleEditMessage}
					/>
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
								<span className={styles.fileBullet}>📎</span>
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

export default observer(PostInMessages);
