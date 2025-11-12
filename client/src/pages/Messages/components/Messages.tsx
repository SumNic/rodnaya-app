import React, { useEffect, useMemo, useRef, useState } from 'react';
import MessagesList from './MessagesList';
import { IPosts } from '../../../models/IPosts';
import { ArrowDownOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Button, Dropdown, FloatButton, MenuProps } from 'antd';
import SendMessage from '../../../components/SendMessage/SendMessage';
import { useMessageContext } from '../../../contexts/MessageContext';
import { useStoreContext } from '../../../contexts/StoreContext';
import { IPost } from '../../../models/IPost';
import MessagesService from '../../../services/MessagesService';
import UserService from '../../../services/UserService';
import { CHAT, COUNT_RESPONSE_POSTS, MESSAGES } from '../../../utils/consts';

import styles from '../MessagesPage.module.css';
import { IGroup } from '../../../models/response/IGroup';
import GroupsService from '../../../services/GroupsService';
import UploadAntdFiles from '../../../components/UploadAntdFiles/UploadAntdFiles';
import AddVideoLink from '../../../components/AddVideoLink';

const initialPosts: IPosts = {
	locality: [],
	region: [],
	country: [],
	world: [],
};

export interface Page {
	locality: number;
	region: number;
	country: number;
	world: number;
}

const initialNextPape: Page = {
	locality: 1,
	region: 1,
	country: 1,
	world: 1,
};

const initialPrevPape: Page = {
	locality: -1,
	region: -1,
	country: -1,
	world: -1,
};

interface FirstLoad {
	locality: boolean;
	region: boolean;
	country: boolean;
	world: boolean;
}

const initialFirstLoad: FirstLoad = {
	locality: true,
	region: true,
	country: true,
	world: true,
};

const indexLocation: Page = {
	locality: 0,
	region: 1,
	country: 2,
	world: 3,
};

interface MessagesProps {
	location: string;
	source: string;
	group?: IGroup;
}

const Messages: React.FC<MessagesProps> = ({ location, source, group }) => {
	const [posts, setPosts] = useState<IPosts>(initialPosts);

	const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
	const [nextPage, setNextPage] = useState<Page>(initialNextPape);
	const [prevPage, setPrevPage] = useState<Page>(initialPrevPape);
	const [isFirstLoad, setIsFirstLoad] = useState<FirstLoad>(initialFirstLoad);
	const [previousScrollHeight, setPreviousScrollHeight] = useState(0);
	const [isScrollEnd, setIsScrollEnd] = useState<Record<string, boolean>>({});
	const [scrollDownPage, setScrollDownPage] = useState(false);
	const [isLastMessageLoad, setIsLastMessageLoad] = useState(false);
	const [isLastMessage, setIsLastMessage] = useState<Record<string, boolean>>({});

	const [showVideoInput, setShowVideoInput] = useState(false);
	const [menuVisible, setMenuVisible] = useState(false);
	const [width, setWidth] = useState<number>();
	const [videoUrls, setVideoUrls] = useState<string[]>([]);
	const [videoError, setVideoError] = useState<string | null>(null);

	const lastMessageRef = useRef<HTMLDivElement | null>(null);
	const messagesRef = useRef<HTMLDivElement | null>(null);
	const widthRef = useRef<HTMLDivElement | null>(null);

	const { store } = useStoreContext();

	const { arrCountNoReadMessages, updateArrCountNoReadMessages } = store.messageStore;
	const { arrCountNoReadPostsGroups, updateArrCountNoReadPostsGroups } = store.groupStore;
	const { user } = store.authStore;

	const {
		setIsLoadMessages,
		messageDataSocket,
		setMessageDataSocket,
		isScrollTop,
		setIsScrollTop,
		messagesContainerRef,
	} = useMessageContext();

	const uploadRef = useRef<any>(null);

	let locationKey: keyof IPosts = location as keyof IPosts;

	useEffect(() => {
		setVideoUrls([]);
		setVideoError(null);
	}, [locationKey]);

	const nameLocal = useMemo(() => {
		let name = '';
		switch (location) {
			case 'locality':
				name = user.residency.locality || '';
				break;
			case 'region':
				name = user.residency.region || '';
				break;
			case 'country':
				name = user.residency.country || '';
				break;
			case 'world':
				name = 'Земля';
				break;
		}
		return name;
	}, [location]);

	useEffect(() => {
		if (widthRef.current) {
			setWidth(widthRef.current.offsetWidth);
		}

		// обновляем при изменении размера окна
		const handleResize = () => {
			if (widthRef.current) {
				setWidth(widthRef.current.offsetWidth);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		const savedScrollTop = localStorage.getItem(`scrollTop-${source}-${locationKey}`);
		if (savedScrollTop && messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop = parseInt(savedScrollTop, 10);
		}
	}, [locationKey]);

	useEffect(() => {
		setPosts(initialPosts);
	}, [source]);

	useEffect(() => {
		if (messageDataSocket && location) {
			const arrFileId = messageDataSocket.form.files;
			const newPost: IPost = {
				id: messageDataSocket.id_message,
				groupId: messageDataSocket.group_id || -1,
				message: messageDataSocket.form.message,
				video: messageDataSocket.form.video || [],
				location: messageDataSocket.resydency,
				blocked: false,
				userId: messageDataSocket.id_user,
				files: arrFileId,
				user: {
					id: messageDataSocket.id_user,
					first_name: messageDataSocket.first_name,
					last_name: messageDataSocket.last_name,
					photo_50: messageDataSocket.photo_50,
				},
				createdAt: messageDataSocket.createdAt,
			};

			let noReadMessagesCount;
			if (source === MESSAGES)
				noReadMessagesCount = arrCountNoReadMessages[indexLocation[location as keyof Page]].count;
			if (source === CHAT)
				noReadMessagesCount = arrCountNoReadPostsGroups.find((elem) => elem.idGroup === group?.id)?.count;

			if (
				nameLocal === messageDataSocket.resydency &&
				isScrollEnd[location] &&
				noReadMessagesCount !== undefined &&
				noReadMessagesCount < COUNT_RESPONSE_POSTS &&
				newPost.userId !== user.id
			) {
				setPosts((prev) => {
					if (newPost) {
						setScrollDownPage(true);
						return { ...prev, [locationKey]: [...prev[locationKey], newPost] };
					}
					return prev;
				});
				if (source === MESSAGES) updateArrCountNoReadMessages(nameLocal, 0);
				if (source === CHAT && messageDataSocket.group_id)
					updateArrCountNoReadPostsGroups(messageDataSocket.group_id, 0);
			}

			if (
				nameLocal === messageDataSocket.resydency &&
				!isScrollEnd[location] &&
				noReadMessagesCount !== undefined &&
				noReadMessagesCount < COUNT_RESPONSE_POSTS &&
				newPost.userId !== user.id
			) {
				setPosts((prev) => {
					if (newPost) {
						return { ...prev, [locationKey]: [...prev[locationKey], newPost] };
					}
					return prev;
				});
				if (source === MESSAGES) updateArrCountNoReadMessages(nameLocal, noReadMessagesCount + 1);
				if (source === CHAT && messageDataSocket.group_id)
					updateArrCountNoReadPostsGroups(messageDataSocket.group_id, noReadMessagesCount + 1);
			}

			if (
				nameLocal === messageDataSocket.resydency &&
				noReadMessagesCount !== undefined &&
				noReadMessagesCount < COUNT_RESPONSE_POSTS &&
				newPost.userId === user.id
			) {
				setPosts((prev) => {
					if (newPost) {
						setScrollDownPage(true);
						return { ...prev, [locationKey]: [...prev[locationKey], newPost] };
					}
					return prev;
				});
				if (source === MESSAGES) updateArrCountNoReadMessages(nameLocal, 0);
				if (source === CHAT && messageDataSocket.group_id)
					updateArrCountNoReadPostsGroups(messageDataSocket.group_id, 0);
			}

			if (
				nameLocal === messageDataSocket.resydency &&
				noReadMessagesCount !== undefined &&
				noReadMessagesCount >= COUNT_RESPONSE_POSTS &&
				newPost.userId === user.id
			) {
				setIsLastMessageLoad(true);
				if (source === MESSAGES) updateArrCountNoReadMessages(nameLocal, 0);
				if (source === CHAT && messageDataSocket.group_id)
					updateArrCountNoReadPostsGroups(messageDataSocket.group_id, 0);
			}

			if (
				nameLocal === messageDataSocket.resydency &&
				noReadMessagesCount !== undefined &&
				noReadMessagesCount >= COUNT_RESPONSE_POSTS &&
				newPost.userId !== user.id
			) {
				setIsLastMessageLoad(true);
				if (source === MESSAGES) updateArrCountNoReadMessages(nameLocal, noReadMessagesCount + 1);
				if (source === CHAT && messageDataSocket.group_id)
					updateArrCountNoReadPostsGroups(messageDataSocket.group_id, noReadMessagesCount + 1);
			}

			if (source === CHAT && messageDataSocket.group_id === group?.id) {
				setPosts((prev) => {
					if (newPost) {
						setScrollDownPage(true);
						return { ...prev, [locationKey]: [...prev[locationKey], newPost] };
					}
					return prev;
				});
			}

			setMessageDataSocket(undefined);
		}
	}, [messageDataSocket, location]);

	// Прокрутка в конец контейнера после загрузки сообщения из сокета
	useEffect(() => {
		if (messagesContainerRef.current && scrollDownPage) {
			const container = messagesContainerRef.current;

			// Устанавливаем прокрутку в самый низ
			requestAnimationFrame(() => {
				container.scrollTop = container.scrollHeight;
			});

			setScrollDownPage(false);
		}
	}, [scrollDownPage]); // Выполнится после загрузки сообщений

	useEffect(() => {
		checkingTheLock();
	}, []);

	const checkingTheLock = async () => {
		try {
			// 1. Получаем данные времени до которого будет действовать блокировка
			const response = await UserService.checkBlocked(store.authStore.user.id);

			if (response.status === 200 && response.data) {
				const blockingEndTimeString = response.data;

				var options: {} = {
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
		} catch (error) {
			console.error('Ошибка checkingTheLock:', error);
			setTimeRemaining(null);
		}
	};

	useEffect(() => {
		if (source === MESSAGES && location && !posts[locationKey].length) {
			loadMessages(location);
		}
	}, [location]);

	useEffect(() => {
		if (source === CHAT && location && group?.id && !posts[locationKey].length) {
			loadPostsGroup(group.id);
		}
	}, [group]);

	useEffect(() => {
		if (location && isLastMessageLoad && !isLastMessage[locationKey]) {
			if (source === MESSAGES) loadMessages(location, nextPage[locationKey]);
			if (source === CHAT && group?.id) loadPostsGroup(group.id, nextPage[locationKey]);
		} else if (location && isLastMessageLoad && isLastMessage[locationKey]) {
			setIsLastMessageLoad(false);
			setScrollDownPage(true);
		}
	}, [isLastMessageLoad, nextPage[locationKey], isLastMessage[locationKey]]);

	const scrollToLastMessage = () => {
		const noReadMessagesCount = arrCountNoReadMessages[indexLocation[location as keyof Page]].count;

		if (noReadMessagesCount && nameLocal) {
			setIsLastMessageLoad(true);
			if (source === MESSAGES) updateArrCountNoReadMessages(nameLocal, 0);
			if (source === CHAT && group?.id) updateArrCountNoReadPostsGroups(group.id, 0);
		} else {
			setIsLastMessageLoad(false);
			setScrollDownPage(true);
		}
	};

	useEffect(() => {
		if (source === MESSAGES && isScrollTop && location && posts[locationKey].length)
			loadPreviousMessages(location, prevPage[locationKey]);
		if (source === CHAT && isScrollTop && group?.id && posts[locationKey].length)
			loadPreviousPostsGroup(group.id, prevPage[locationKey]);
		setIsScrollTop(false);
	}, [isScrollTop]);

	useEffect(() => {
		if (!lastMessageRef.current) return;

		const observer = new IntersectionObserver((entries) => {
			if (!location) return;
			if (entries[0].isIntersecting) {
				setIsScrollEnd((prev) => ({ ...prev, [location]: true }));
				if (source === MESSAGES) loadMessages(location, nextPage[locationKey]);
				if (source === CHAT && group?.id) loadPostsGroup(group.id, nextPage[locationKey]);
			} else {
				setIsScrollEnd((prev) => ({ ...prev, [location]: false }));
			}
		});

		observer.observe(lastMessageRef.current);

		return () => observer.disconnect();
	}, [posts[locationKey]]);

	const loadMessages = async (location: string, pageNumber: number = 1) => {
		if (isLastMessage[location]) return;
		try {
			setIsLoadMessages(true);
			const allMessages = await MessagesService.getAllMessages(
				store.authStore.user.id,
				pageNumber,
				store.authStore.user.secret,
				location
			);
			if (allMessages.data && allMessages.data.length > 0) {
				if (posts[locationKey].includes(allMessages.data[0])) return;
				setPosts((prev) => ({ ...prev, [locationKey]: [...prev[locationKey], ...allMessages.data] }));
				setNextPage((prev) => ({ ...prev, [locationKey]: pageNumber + 1 }));
			} else {
				setIsLastMessage((prev) => ({ ...prev, [locationKey]: true }));
			}
			setIsLoadMessages(false);
		} catch (err) {
			setIsLoadMessages(false);
			console.error(`Ошибка в loadMessages: ${err}`);
		}
	};

	const loadPostsGroup = async (groupId: number, pageNumber: number = 1) => {
		if (isLastMessage[location]) return;
		try {
			setIsLoadMessages(true);
			const allMessages = await GroupsService.getAllPosts(groupId, pageNumber);
			if (allMessages.data && allMessages.data.length > 0) {
				if (posts[locationKey].includes(allMessages.data[0])) return;
				setPosts((prev) => ({ ...prev, [locationKey]: [...prev[locationKey], ...allMessages.data] }));
				setNextPage((prev) => ({ ...prev, [locationKey]: pageNumber + 1 }));
			} else {
				setIsLastMessage((prev) => ({ ...prev, [locationKey]: true }));
			}
			setIsLoadMessages(false);
		} catch (err) {
			setIsLoadMessages(false);
			console.error(`Ошибка в loadMessages: ${err}`);
		}
	};

	// Прокрутка в конец контейнера после загрузки сообщений
	useEffect(() => {
		if (isFirstLoad[locationKey] && messagesContainerRef.current && posts[locationKey].length) {
			const container = messagesContainerRef.current;

			// Отключаем анимацию скролла
			container.style.scrollBehavior = 'auto';

			// Устанавливаем прокрутку в самый низ
			requestAnimationFrame(() => {
				container.scrollTop = container.scrollHeight;

				// Включаем плавную прокрутку снова
				requestAnimationFrame(() => {
					container.style.scrollBehavior = 'smooth';
				});
			});

			setIsFirstLoad((prev) => ({ ...prev, [locationKey]: false }));
		}
	}, [posts[locationKey]]); // Выполнится после загрузки сообщений

	const loadPreviousPostsGroup = async (groupId: number, pageNumber: number) => {
		if (!messagesContainerRef.current || !messagesRef.current) return;

		const container = messagesRef.current;
		const currentScrollHeight = container.scrollHeight; // Сохраняем высоту перед добавлением

		try {
			setIsLoadMessages(true);

			const allMessages = await GroupsService.getAllPosts(groupId, pageNumber);
			if (allMessages.data && allMessages.data.length > 0) {
				setPosts((prev) => ({
					...prev,
					[locationKey]: [...allMessages.data, ...prev[locationKey]], // Добавляем в начало
				}));

				setPrevPage((prev) => ({ ...prev, [locationKey]: pageNumber - 1 })); // Двигаемся назад
				setPreviousScrollHeight(currentScrollHeight);
			}

			setIsLoadMessages(false);
		} catch (err) {
			setIsLoadMessages(false);
			console.error(`Ошибка в loadPreviousMessages: ${err}`);
		}
	};

	const loadPreviousMessages = async (location: string, pageNumber: number) => {
		if (!messagesContainerRef.current || !messagesRef.current) return;

		const container = messagesRef.current;
		const currentScrollHeight = container.scrollHeight; // Сохраняем высоту перед добавлением

		try {
			setIsLoadMessages(true);

			const allMessages = await MessagesService.getAllMessages(
				store.authStore.user.id,
				pageNumber,
				store.authStore.user.secret,
				location
			);

			if (allMessages.data && allMessages.data.length > 0) {
				setPosts((prev) => ({
					...prev,
					[locationKey]: [...allMessages.data, ...prev[locationKey]], // Добавляем в начало
				}));

				setPrevPage((prev) => ({ ...prev, [locationKey]: pageNumber - 1 })); // Двигаемся назад
				setPreviousScrollHeight(currentScrollHeight);
			}

			setIsLoadMessages(false);
		} catch (err) {
			setIsLoadMessages(false);
			console.error(`Ошибка в loadPreviousMessages: ${err}`);
		}
	};

	useEffect(() => {
		if (messagesContainerRef.current && messagesRef.current && previousScrollHeight !== 0) {
			// Отключаем плавный скролл перед изменением
			messagesContainerRef.current.style.scrollBehavior = 'auto';

			// Восстанавливаем позицию скролла
			requestAnimationFrame(() => {
				if (messagesContainerRef.current && messagesRef.current) {
					const newScrollHeight = messagesRef.current.scrollHeight;
					messagesContainerRef.current.scrollTop += newScrollHeight - previousScrollHeight;

					// Включаем плавный скролл снова
					requestAnimationFrame(() => {
						if (messagesContainerRef.current) {
							messagesContainerRef.current.style.scrollBehavior = 'smooth';
						}
					});
				}
			});
			setPreviousScrollHeight(0);
		}
	}, [posts[locationKey]]); // Выполнится после загрузки сообщений

	const handleClick = () => {
		const input = uploadRef.current?.upload?.uploader?.fileInput;
		if (input) input.click();
	};

	const menuItems: MenuProps['items'] = [
		{
			key: 'uploadFile',
			label: <span onClick={handleClick}>Добавить файл</span>,
		},
		{
			key: 'addVideo',
			label: 'Добавить видео',
		},
	];

	const handleMenuClick = ({ key }: { key: string }) => {
		if (key === 'uploadFile') {
			if (!videoUrls.length) setShowVideoInput(false);
		} else if (key === 'addVideo') {
			setShowVideoInput(true);
		}
		setMenuVisible(false);
	};

	return (
		<>
			{location && (
				<MessagesList
					posts={posts}
					location={location}
					messagesRef={messagesRef}
					lastMessageRef={lastMessageRef}
					groupId={group?.id}
				/>
			)}
			{!isScrollEnd[locationKey] && (
				<FloatButton
					icon={<ArrowDownOutlined />}
					type="default"
					style={{ position: 'absolute', right: 20, bottom: 74 }} // Позиционирование внизу справа
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
									<label htmlFor="fileToUpload">
										<Dropdown
											menu={{ items: menuItems, onClick: handleMenuClick }}
											trigger={['click']}
											open={menuVisible}
											onOpenChange={(flag) => setMenuVisible(flag)}
										>
											<Button type="text" icon={<PaperClipOutlined style={{ color: '#b1b3b1', fontSize: '35px' }} />} />
										</Dropdown>
									</label>
								</div>
							</div>

							{location && (
								<SendMessage
									location={location}
									groupId={group?.id}
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
