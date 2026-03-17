import React, { useEffect, useRef, useState } from 'react';
// import MessagesList from './MessagesList.tsx';
import { ArrowDownOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Button, Dropdown, FloatButton, MenuProps } from 'antd';
import SendMessage from '../../../components/SendMessage/SendMessage.tsx';
import { useStoreContext } from '../../../contexts/StoreContext.ts';
import UserService, { User } from '../../../services/UserService.ts';

import styles from '../GroupPage.module.css';
import GroupsService, { GetPostsGroupDto, Group, GroupMessage } from '../../../services/GroupsService.ts';
import UploadAntdFiles from '../../../components/UploadAntdFiles/UploadAntdFiles.tsx';
import AddVideoLink from '../../../components/AddVideoLink.tsx';
import { IMessages } from '../../../models/IMessages.ts';
import { useGroupContext } from '../../../contexts/GroupContext.ts';
import GroupPostsList from './GroupPostsList.tsx';

export interface Page {
	locality: number;
	region: number;
	country: number;
	world: number;
}

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

interface MessagesProps {
	location: string;
	group: Group;
}

const GroupPosts: React.FC<MessagesProps> = ({ location, group }) => {
	const [posts, setPosts] = useState<GroupMessage[]>([]);

	const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
	const [isFirstLoad, setIsFirstLoad] = useState<FirstLoad>(initialFirstLoad);
	const [previousScrollHeight, setPreviousScrollHeight] = useState(0);
	const [isScrollEnd, setIsScrollEnd] = useState<boolean>(false);
	const [scrollDownPage, setScrollDownPage] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const [showVideoInput, setShowVideoInput] = useState(false);
	const [menuVisible, setMenuVisible] = useState(false);
	const [width, setWidth] = useState<number>();
	const [videoUrls, setVideoUrls] = useState<string[]>([]);
	const [videoError, setVideoError] = useState<string | null>(null);

	const lastMessageRef = useRef<HTMLDivElement | null>(null);
	const messagesRef = useRef<HTMLDivElement | null>(null);
	const widthRef = useRef<HTMLDivElement | null>(null);

	const { store } = useStoreContext();

	const { arrCountNoReadPostsGroups, updateArrCountNoReadPostsGroups } = store.groupStore;
	const { user } = store.authStore;

	const {
		isLoadGroups,
		setIsLoadGroups,
		groupDataSocket,
		setGroupDataSocket,
		isScrollTop,
		setIsScrollTop,
		groupsContainerRef,
	} = useGroupContext();

	const uploadRef = useRef<any>(null);

	let locationKey: keyof IMessages = location as keyof IMessages;

	useEffect(() => {
		setVideoUrls([]);
		setVideoError(null);
	}, [locationKey, group.id]);

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

	const handleSocketMessage = (newPost: GroupMessage) => {
		const isMy = newPost.userId === user.id;
		const isSameGroup = newPost.groupId === group.id;

		const unread = arrCountNoReadPostsGroups.find((g) => g.groupId === group.id)?.count ?? 0;

		setPosts((prev) => {
			if (prev.some((p) => p.id === newPost.id)) return prev;
			return [...prev, newPost];
		});

		if (isMy) {
			// 🔥 ВАЖНО: без условий
			setScrollDownPage(true);
			updateArrCountNoReadPostsGroups(group.id, 0, location);
			return;
		}

		if (isSameGroup && isScrollEnd) {
			setScrollDownPage(true);
			updateArrCountNoReadPostsGroups(group.id, 0, location);
		} else if (isSameGroup) {
			updateArrCountNoReadPostsGroups(group.id, unread + 1, location);
		}
	};

	useEffect(() => {
		if (groupDataSocket && location) {
			const arrFileId = groupDataSocket.form.files;
			const newPost: GroupMessage = {
				id: groupDataSocket.id_message,
				groupId: groupDataSocket.group_id || -1,
				message: groupDataSocket.form.message,
				video: groupDataSocket.form.video || [],
				location: groupDataSocket.resydency,
				blocked: false,
				userId: groupDataSocket.id_user,
				files: arrFileId,
				user: {
					id: groupDataSocket.id_user,
					first_name: groupDataSocket.first_name,
					last_name: groupDataSocket.last_name,
					photo_50: groupDataSocket.photo_50,
				} as User,
				createdAt: groupDataSocket.createdAt.toString(),
				updatedAt: groupDataSocket.createdAt.toString(),
			};

			if (groupDataSocket) {
				handleSocketMessage(newPost);
				setGroupDataSocket(undefined);
			}
		}
	}, [groupDataSocket, location]);

	// Прокрутка в конец контейнера после загрузки сообщения из сокета
	useEffect(() => {
		if (groupsContainerRef.current && scrollDownPage) {
			const container = groupsContainerRef.current;

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
		} catch (error) {
			console.error('Ошибка checkingTheLock:', error);
			setTimeRemaining(null);
		}
	};

	useEffect(() => {
		if (group?.id && !posts.length) {
			loadPosts(group.id);
		}
	}, [group.id]);

	useEffect(() => {
		if (!hasMore) {
			if (group?.id) loadPosts(group.id, posts.at(-1)?.id, 'after');
		} else {
			setHasMore(false);
			setScrollDownPage(true);
		}
	}, [hasMore]);

	// Переход к последнему сообщению по кнопке
	const scrollToLastMessage = () => {
		const noReadMessagesCount = arrCountNoReadPostsGroups.find((g) => g.groupId === group.id)?.count;

		if (noReadMessagesCount) {
			setHasMore(true);
			updateArrCountNoReadPostsGroups(group.id, 0, locationKey);
		} else {
			setHasMore(false);
			setScrollDownPage(true);
		}
	};

	useEffect(() => {
		if (isScrollTop && group?.id && posts.length) loadPosts(group.id, posts[0].id, 'before');
		setIsScrollTop(false);
	}, [isScrollTop]);

	useEffect(() => {
		if (!lastMessageRef.current || !groupsContainerRef.current) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsScrollEnd(true);
					loadPosts(group.id, posts.at(-1)?.id, 'after');
				} else {
					setIsScrollEnd(false);
				}
			},
			{ root: groupsContainerRef.current, threshold: 0.8 }
		);

		observer.observe(lastMessageRef.current);
		return () => observer.disconnect();
	}, [posts.length, hasMore]);

	const loadPosts = async (groupId: number, cursor?: number, direction?: GetPostsGroupDto['direction']) => {
		if (isLoadGroups) return;
		try {
			setIsLoadGroups(true);
			const { data = [] } = await GroupsService.getAllPosts({ groupId, cursor, direction });

			setPosts((prev) => {
				const ids = new Set(prev.map((p) => p.id));
				const fresh = data.filter((m) => !ids.has(m.id));
				return direction === 'before' ? [...fresh, ...prev] : [...prev, ...fresh];
			});
		} catch (err) {
			console.error(`Ошибка в loadMessages: ${err}`);
		} finally {
			setIsLoadGroups(false);
		}
	};

	// Прокрутка в конец контейнера после загрузки сообщений
	useEffect(() => {
		if (isFirstLoad[locationKey] && groupsContainerRef.current && posts.length) {
			const container = groupsContainerRef.current;

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
	}, [posts]); // Выполнится после загрузки сообщений

	useEffect(() => {
		if (groupsContainerRef.current && messagesRef.current && previousScrollHeight !== 0) {
			// Отключаем плавный скролл перед изменением
			groupsContainerRef.current.style.scrollBehavior = 'auto';

			// Восстанавливаем позицию скролла
			requestAnimationFrame(() => {
				if (groupsContainerRef.current && messagesRef.current) {
					const newScrollHeight = messagesRef.current.scrollHeight;
					groupsContainerRef.current.scrollTop += newScrollHeight - previousScrollHeight;

					// Включаем плавный скролл снова
					requestAnimationFrame(() => {
						if (groupsContainerRef.current) {
							groupsContainerRef.current.style.scrollBehavior = 'smooth';
						}
					});
				}
			});
			setPreviousScrollHeight(0);
		}
	}, [posts]); // Выполнится после загрузки сообщений

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

	const deletePost = (id: number) => {
		setPosts((prev) => prev.filter((post) => post.id !== id));
	};

	return (
		<>
			{location && group && (
				<GroupPostsList
					posts={posts}
					location={location}
					messagesRef={messagesRef}
					lastMessageRef={lastMessageRef}
					groupId={group.id}
					deletePost={deletePost}
				/>
			)}
			{!isScrollEnd && (
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

export default GroupPosts;
