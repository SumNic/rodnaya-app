import React, { useEffect, useRef, useState } from 'react';
import MessagesList from './MessagesList.tsx';
import { ArrowDownOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Button, Dropdown, FloatButton, MenuProps } from 'antd';
import SendMessage from '../../../components/SendMessage/SendMessage.tsx';
import { useMessageContext } from '../../../contexts/MessageContext.ts';
import { useStoreContext } from '../../../contexts/StoreContext.ts';
import MessagesService from '../../../services/MessagesService.ts';
import UserService, { Residency } from '../../../services/UserService.ts';
import UploadAntdFiles from '../../../components/UploadAntdFiles/UploadAntdFiles.tsx';
import AddVideoLink from '../../../components/AddVideoLink.tsx';
import { MessageWithPartialUser } from '../../../models/IMessages.ts';
import styles from '../MessagesPage.module.css';

interface MessagesProps {
	location: string;
}

const Messages: React.FC<MessagesProps> = ({ location }) => {
	const { store } = useStoreContext();
	const { messageStore, authStore } = store;

	const {
		setIsLoadMessages,
		messageDataSocket,
		setMessageDataSocket,
		isScrollTop,
		setIsScrollTop,
		messagesContainerRef,
	} = useMessageContext();

	/* UI state (НЕ данные сообщений) */
	const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
	const [showVideoInput, setShowVideoInput] = useState(false);
	const [menuVisible, setMenuVisible] = useState(false);
	const [width, setWidth] = useState<number>();
	const [videoUrls, setVideoUrls] = useState<string[]>([]);
	const [videoError, setVideoError] = useState<string | null>(null);
	const [isScrollEnd, setIsScrollEnd] = useState(false);

	/* refs */
	const uploadRef = useRef<any>(null);
	const lastMessageRef = useRef<HTMLDivElement | null>(null);
	const messagesRef = useRef<HTMLDivElement | null>(null);
	const widthRef = useRef<HTMLDivElement | null>(null);
	const locationRef = useRef(location);

	/* кеш */
	const cache = messageStore.get(location);
	const posts = cache.posts;

	/* ========================= */
	/* location sync */
	/* ========================= */

	useEffect(() => {
		locationRef.current = location;
	}, [location]);

	/* ========================= */
	/* blocked check */
	/* ========================= */

	useEffect(() => {
		const checkingTheLock = async () => {
			try {
				const response = await UserService.checkBlocked(authStore.user.id);

				if (response.status === 200 && response.data) {
					const blockingEndTimeString = response.data;
					const options: {} = {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
						timezone: 'UTC',
						hour: 'numeric',
						minute: 'numeric',
					};
					let blockingEndTime = new Date(blockingEndTimeString).toLocaleString('ru', options);
					setTimeRemaining(blockingEndTime);
				}
			} catch {
				setTimeRemaining(null);
			}
		};

		checkingTheLock();
	}, []);

	/* ========================= */
	/* width */
	/* ========================= */

	useEffect(() => {
		if (widthRef.current) setWidth(widthRef.current.offsetWidth);

		const handleResize = () => {
			if (widthRef.current) setWidth(widthRef.current.offsetWidth);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	/* ========================= */
	/* initial load */
	/* ========================= */

	useEffect(() => {
		if (!location) return;
		if (cache.hasLoaded && cache.posts.length > 0) return;
		loadMessages(location, cache.nextPage);
	}, [location]);

	/* ========================= */
	/* socket */
	/* ========================= */

	useEffect(() => {
		if (!messageDataSocket) return;

		const { location: locKey, resydency } = messageDataSocket;

		/* 1. Проверка принадлежности к residency */
		if (store.authStore.user.residency[locKey as keyof Residency] !== resydency) {
			setMessageDataSocket(undefined);
			return;
		}

		const cache = messageStore.get(locKey);

		/* 2. Если есть непрочитанный разрыв — НЕ добавляем */
		if (!cache.isLastMessage) {
			// счётчик непрочитанных сообщений увеличивается в useMessgae.hook
			setMessageDataSocket(undefined);
			return;
		}

		/* 3. Маппинг */
		const msg: MessageWithPartialUser = {
			id: messageDataSocket.id_message,
			message: messageDataSocket.form.message,
			video: messageDataSocket.form.video || [],
			location: messageDataSocket.resydency,
			blocked: false,
			userId: messageDataSocket.id_user,
			files: messageDataSocket.form.files,
			user: {
				id: messageDataSocket.id_user,
				first_name: messageDataSocket.first_name,
				last_name: messageDataSocket.last_name,
				photo_50: messageDataSocket.photo_50,
			},
			createdAt: messageDataSocket.createdAt.toString(),
			updatedAt: messageDataSocket.createdAt.toString(),
		};

		messageStore.addMessages(locKey, [msg]);

		const my = msg.userId === authStore.user.id;
		if (my) scrollToLastMessage();
		setMessageDataSocket(undefined);
	}, [messageDataSocket]);

	/* ========================= */
	/* scroll cache */
	/* ========================= */

	useEffect(() => {
		const container = messagesContainerRef.current;
		if (!container || !location) return;

		const handleScroll = () => {
			messageStore.set(location, {
				scrollTop: container.scrollTop,
			});
		};

		container.addEventListener('scroll', handleScroll);
		return () => container.removeEventListener('scroll', handleScroll);
	}, [location]);

	/* ========================= */
	/* restore scroll */
	/* ========================= */

	useEffect(() => {
		if (!messagesContainerRef.current) return;
		if (cache.scrollTop == null) return;

		requestAnimationFrame(() => {
			if (messagesContainerRef.current) {
				messagesContainerRef.current.scrollTop = cache.scrollTop ?? 0;
			}
		});
	}, [location]);

	/* ========================= */
	/* infinite scroll down */
	/* ========================= */

	useEffect(() => {
		if (!lastMessageRef.current) return;

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && !cache.isLastMessage) {
				loadMessages(location, cache.nextPage);
			} else {
				setIsScrollEnd(false);
			}
		});

		observer.observe(lastMessageRef.current);
		return () => observer.disconnect();
	}, [location, cache.nextPage, cache.isLastMessage]);

	/* ========================= */
	/* infinite scroll up */
	/* ========================= */

	useEffect(() => {
		if (!isScrollTop) return;
		loadPreviousMessages(location, cache.prevPage);
		setIsScrollTop(false);
	}, [isScrollTop]);

	/* ========================= */
	/* loaders */
	/* ========================= */

	const loadMessages = async (loc: string, page = 1) => {
		if (messageStore.get(loc).isLastMessage) return;

		try {
			setIsLoadMessages(true);
			const res = await MessagesService.getAllMessages(page, loc);
			if (locationRef.current !== loc) return;

			if (res.data?.length) {
				messageStore.addMessages(loc, res.data);
				messageStore.set(loc, {
					nextPage: page + 1,
					hasLoaded: true,
				});
			} else {
				messageStore.set(loc, {
					isLastMessage: true,
					hasLoaded: true,
				});
			}
		} finally {
			setIsLoadMessages(false);
		}
	};

	const loadPreviousMessages = async (loc: string, page: number) => {
		if (!messagesContainerRef.current || !messagesRef.current) return;

		const container = messagesRef.current;
		const prevHeight = container.scrollHeight;

		try {
			setIsLoadMessages(true);
			const res = await MessagesService.getAllMessages(page, loc);
			if (locationRef.current !== loc) return;

			if (res.data?.length) {
				messageStore.prependMessages(loc, res.data);
				messageStore.set(loc, { prevPage: page - 1 });

				requestAnimationFrame(() => {
					const newHeight = container.scrollHeight;
					messagesContainerRef.current!.scrollTop += newHeight - prevHeight;
				});
			}
		} finally {
			setIsLoadMessages(false);
		}
	};

	/* ========================= */
	/* UI handlers */
	/* ========================= */

	const handleClick = () => {
		const input = uploadRef.current?.upload?.uploader?.fileInput;
		if (input) input.click();
	};

	const menuItems: MenuProps['items'] = [
		{ key: 'uploadFile', label: <span onClick={handleClick}>Добавить файл</span> },
		{ key: 'addVideo', label: 'Добавить видео' },
	];

	const handleMenuClick = ({ key }: { key: string }) => {
		if (key === 'uploadFile') {
			if (!videoUrls.length) setShowVideoInput(false);
		}
		if (key === 'addVideo') setShowVideoInput(true);
		setMenuVisible(false);
	};

	const deletePost = (id: number) => {
		const filtered = posts.filter((p) => p.id !== id);
		messageStore.set(location, { posts: filtered });
	};

	const scrollToLastMessage = () => {
		if (!messagesContainerRef.current) return;
		requestAnimationFrame(() => {
			messagesContainerRef.current!.scrollTop = messagesContainerRef.current!.scrollHeight;
		});
	};

	/* ========================= */
	/* render */
	/* ========================= */

	return (
		<>
			{location && (
				<MessagesList
					posts={posts}
					location={location}
					messagesRef={messagesRef}
					lastMessageRef={lastMessageRef}
					deletePost={deletePost}
				/>
			)}

			{!isScrollEnd && (
				<FloatButton
					icon={<ArrowDownOutlined />}
					type="default"
					style={{ position: 'absolute', right: 20, bottom: 74 }}
					onClick={scrollToLastMessage}
				/>
			)}

			<div id={styles.messages} ref={widthRef}>
				{timeRemaining !== null ? (
					<div className={styles['blocked_text']}>
						<p>Вы заблокированы за нарушение правил.</p>
						<p> Блокировка заканчивается {timeRemaining}</p>
					</div>
				) : (
					<>
						{showVideoInput && (
							<div style={{ width: '100%', padding: '8px 15px' }}>
								<AddVideoLink
									videoUrls={videoUrls}
									setVideoUrls={setVideoUrls}
									videoError={videoError}
									setVideoError={setVideoError}
								/>
							</div>
						)}

						<div style={{ paddingLeft: '10px' }}>
							<UploadAntdFiles isHiddenButton={true} uploadRef={uploadRef} width={width} />
						</div>

						<div id="forms">
							<div className="clip">
								<div className="label-clip">
									<label>
										<Dropdown
											menu={{ items: menuItems, onClick: handleMenuClick }}
											trigger={['click']}
											open={menuVisible}
											onOpenChange={setMenuVisible}
										>
											<Button type="text" icon={<PaperClipOutlined style={{ color: '#b1b3b1', fontSize: '35px' }} />} />
										</Dropdown>
									</label>
								</div>
							</div>

							{location && (
								<SendMessage
									location={location}
									videoUrls={videoUrls}
									setVideoUrls={setVideoUrls}
									setShowVideoInput={setShowVideoInput}
								/>
							)}
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default Messages;
