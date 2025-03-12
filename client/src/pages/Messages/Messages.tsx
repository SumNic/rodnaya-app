import { observer } from 'mobx-react-lite';
import Footer from '../../components/Footer';
import NavMiddle from '../../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile';
import NavRegions from '../../components/Nav_header/NavRegions';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MessagesService from '../../services/MessagesService';
import MessagesList from './components/MessagesList';
import UploadFiles from '../../components/UploadFiles';
import SendMessage from '../../components/SendMessage/SendMessage.tsx';
import icon_attach from '../../images/clippy-icon1.png';
import { useStoreContext } from '../../contexts/StoreContext';
import { COUNT_RESPONSE_POSTS, HOME_ROUTE, MESSAGES_ROUTE } from '../../utils/consts';
import { FloatButton, Modal, Typography } from 'antd';
import HeaderLogoPc from '../../components/HeaderLogo/HeaderLogoPc';
import { useMessageContext } from '../../contexts/MessageContext.ts';
import UserService from '../../services/UserService.ts';

import { IPost } from '../../models/IPost.ts';
import { IPosts } from '../../models/IPosts.ts';
import { ArrowDownOutlined } from '@ant-design/icons';

import styles from './Messages.module.css';

const { Text } = Typography;

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

const Message: React.FC = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
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

	const { store } = useStoreContext();
	const { arrCountNoReadMessages, updateArrCountNoReadMessages } = store.messageStore;
	const { user } = store.authStore;

	const { setIsLoadMessages, messageDataSocket, isScrollTop, setIsScrollTop, messagesContainerRef } =
		useMessageContext();
	const navigate = useNavigate();

	const lastMessageRef = useRef<HTMLDivElement | null>(null);
	const messagesRef = useRef<HTMLDivElement | null>(null);

	const params = useParams();
	const location: string | undefined = params.location;

	let locationKey: keyof IPosts = location as keyof IPosts;

	useEffect(() => {
		const savedScrollTop = localStorage.getItem(`scrollTop-${locationKey}`);
		if (savedScrollTop && messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop = parseInt(savedScrollTop, 10);
		}
	}, [locationKey]);

	useEffect(() => {
		if (messageDataSocket && location) {
			const arrFileId = JSON.parse(messageDataSocket.form.files);
			const newPost: IPost = {
				id: messageDataSocket.id_message,
				message: messageDataSocket.form.message,
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

			const noReadMessagesCount = arrCountNoReadMessages[indexLocation[location as keyof Page]].count;

			if (
				nameLocal === messageDataSocket.resydency &&
				isScrollEnd[location] &&
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
				updateArrCountNoReadMessages(nameLocal, 0);
			}

			if (
				nameLocal === messageDataSocket.resydency &&
				!isScrollEnd[location] &&
				noReadMessagesCount < COUNT_RESPONSE_POSTS &&
				newPost.userId !== user.id
			) {
				setPosts((prev) => {
					if (newPost) {
						return { ...prev, [locationKey]: [...prev[locationKey], newPost] };
					}
					return prev;
				});
				updateArrCountNoReadMessages(nameLocal, noReadMessagesCount + 1);
			}

			if (
				nameLocal === messageDataSocket.resydency &&
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
				updateArrCountNoReadMessages(nameLocal, 0);
			}

			if (
				nameLocal === messageDataSocket.resydency &&
				noReadMessagesCount >= COUNT_RESPONSE_POSTS &&
				newPost.userId === user.id
			) {
				setIsLastMessageLoad(true);
				updateArrCountNoReadMessages(nameLocal, 0);
			}

			if (
				nameLocal === messageDataSocket.resydency &&
				noReadMessagesCount >= COUNT_RESPONSE_POSTS &&
				newPost.userId !== user.id
			) {
				setIsLastMessageLoad(true);
				updateArrCountNoReadMessages(nameLocal, noReadMessagesCount + 1);
			}
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
		if (location && !posts[locationKey].length) loadMessages(location);
	}, [location]);

	useEffect(() => {
		if (location && isLastMessageLoad && !isLastMessage[locationKey]) {
			loadMessages(location, nextPage[locationKey]);
		} else if (location && isLastMessageLoad && isLastMessage[locationKey]) {
			setIsLastMessageLoad(false);
			setScrollDownPage(true);
		}
	}, [isLastMessageLoad, nextPage[locationKey], isLastMessage[locationKey]]);

	const scrollToLastMessage = () => {
		const noReadMessagesCount = arrCountNoReadMessages[indexLocation[location as keyof Page]].count;

		if (noReadMessagesCount && nameLocal) {
			setIsLastMessageLoad(true);
			updateArrCountNoReadMessages(nameLocal, 0);
		} else {
			setIsLastMessageLoad(false);
			setScrollDownPage(true);
		}
	};

	useEffect(() => {
		if (isScrollTop && location && posts[locationKey].length) loadPreviousMessages(location, prevPage[locationKey]);
		setIsScrollTop(false);
	}, [isScrollTop]);

	useEffect(() => {
		if (!lastMessageRef.current) return;

		const observer = new IntersectionObserver((entries) => {
			if (!location) return;
			if (entries[0].isIntersecting) {
				setIsScrollEnd((prev) => ({ ...prev, [location]: true }));
				loadMessages(location, nextPage[locationKey]);
			} else {
				setIsScrollEnd((prev) => ({ ...prev, [location]: false }));
			}
		});

		observer.observe(lastMessageRef.current);

		return () => observer.disconnect();
	}, [posts[locationKey]]);

	const loadMessages = async (location: string, pageNumber: number = 1) => {
		try {
			setIsLoadMessages(true);
			const allMessages = await MessagesService.getAllMessages(
				store.authStore.user.id,
				pageNumber,
				store.authStore.user.secret,
				location
			);
			if (allMessages.data && allMessages.data.length > 0) {
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

	const nameLocal = useMemo(() => {
		let name = '';
		switch (location) {
			case 'locality':
				name = store.authStore.user.residency.locality || '';
				break;
			case 'region':
				name = store.authStore.user.residency.region || '';
				break;
			case 'country':
				name = store.authStore.user.residency.country || '';
				break;
			case 'world':
				name = 'Земля';
				break;
			default:
				setModalOpen(true);
				break;
		}
		return name;
	}, [location]);

	return (
		<div>
			<header className="header">
				<div className="header__wrapper">
					<HeaderLogoPc />
					<HeaderLogoMobile />
					{location && <NavRegions location={location} />}
				</div>
			</header>
			<div className="middle">
				<div className="middle__wrapper">
					<NavMiddle item={MESSAGES_ROUTE} />
					<div className="main__screen main__screen_home logotip-background">
						<div className="name">
							<h2 className="name__local" id="name">
								{nameLocal}
							</h2>
						</div>
						{location && (
							<MessagesList
								posts={posts}
								location={location}
								messagesRef={messagesRef}
								lastMessageRef={lastMessageRef}
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
						<div id={styles.messages}>
							{timeRemaining !== null ? (
								<div className={styles['blocked_text']}>
									<p>Вы заблокированы за нарушение правил.</p>
									<p> Блокировка заканчивается {timeRemaining}</p>
								</div>
							) : (
								<>
									{/*TODO переделать отправку файлов на antd */}
									<UploadFiles />
									<div id="forms">
										<div className="clip">
											<div className="label-clip">
												<label htmlFor="fileToUpload">
													<img className="clippy-icon" src={icon_attach} alt="Прикрепить" />
												</label>
											</div>
										</div>

										{location && <SendMessage location={location} />}
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
			<Modal open={modalOpen} onOk={() => navigate(HOME_ROUTE)} onCancel={() => setModalOpen(false)} width={400}>
				<Text>Страница не существует. Вернуться на главную?</Text>
			</Modal>
			<Footer />
		</div>
	);
};

export default observer(Message);
