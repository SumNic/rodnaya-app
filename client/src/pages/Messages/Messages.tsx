import { observer } from 'mobx-react-lite';
import Footer from '../../components/Footer';
import NavMiddle from '../../components/Nav_middle/NavMiddle';
import HeaderLogoMobile from '../../components/HeaderLogo/HeaderLogoMobile';
import NavRegions from '../../components/Nav_header/NavRegions';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MessagesService from '../../services/MessagesService';
import MessagesList from './components/MessagesList';
import UploadFiles from '../../components/UploadFiles';
import SendMessage from '../../components/SendMessage';
import icon_attach from '../../images/clippy-icon1.png';
import { useStoreContext } from '../../contexts/StoreContext';
import { HOME_ROUTE, LocationEnum, MESSAGES_ROUTE } from '../../utils/consts';
import { Modal, Typography } from 'antd';
import HeaderLogoPc from '../../components/HeaderLogo/HeaderLogoPc';
import { useMessageContext } from '../../contexts/MessageContext.ts';
import UserService from '../../services/UserService.ts';

import styles from './Messages.module.css';
import { throttle } from 'lodash';
import { IPost } from '../../models/IPost.ts';

const { Text } = Typography;

type scrollOver = {
	[key: string]: boolean;
};

const Message: React.FC = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [isMemoizedIndexMap, setMemoizedIndexMap] = useState(true);
	const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
	const [isScrollEnd, setIsScrollEnd] = useState<scrollOver>();
	const [isScrollStart, setIsScrollStart] = useState<scrollOver>();

	const { store } = useStoreContext();
	const {
		sendMessageId,
		arrEndMessagesId,
		posts,
		setPosts,
		isLoadMessages,
		setIsLoadMessages,
		isLoadingPrevious,
		setIsLoadingPrevious,
		isLoadingNext,
		setIsLoadingNext,
		messageDataSocket,
	} = useMessageContext();
	const navigate = useNavigate();

	const targetRefNext = useRef<HTMLDivElement | null>(null);
	const targetRefPrev = useRef<HTMLDivElement | null>(null);

	const params = useParams();
	const location: string | undefined = params.location;

	useEffect(() => {
		setIsScrollEnd((prev) => {
			if (location) return { ...prev, [location]: false };
		});
		setIsScrollStart((prev) => {
			if (location) return { ...prev, [location]: false };
		});
	}, [location]);

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

			if (
				nameLocal === messageDataSocket.resydency && isScrollEnd && isScrollEnd[location]
			) {
				setPosts((prev) => {
					if (prev?.length && newPost) {
						const postsFromLocation = prev.filter((elem) => elem.location === location);
						if (postsFromLocation.length) {
							const newListPosts = [...postsFromLocation[0].postsCurrent, newPost];
							return prev.map((postsInLocation) =>
								postsInLocation.location === location
									? { ...postsInLocation, postsCurrent: newListPosts }
									: postsInLocation
							);
						}
					}
					return prev;
				});
			}
		}
	}, [messageDataSocket]);

	const handleScroll = useCallback(
		throttle(() => {
			const checkVisibility = (targetElement: HTMLDivElement | null, targetIndex: number) => {
				if (targetElement) {
					const rect = targetElement.getBoundingClientRect();

					if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
						if (targetIndex === 1 && !isLoadingPrevious && !isLoadMessages) {
							if (isScrollStart && location && isScrollStart[location] === false) {
								setIsLoadingPrevious(true);
								loadPreviousMessages();
							}
						} else if (targetIndex === 2 && !isLoadingNext && !isLoadMessages) {
							if (isScrollEnd && location && isScrollEnd[location] === false) {
								setIsLoadingNext(true);
								loadNextMessages();
							}
						}
					}
				}
			};

			checkVisibility(targetRefPrev.current, 1);
			checkVisibility(targetRefNext.current, 2);
		}, 500),
		[posts, location, isLoadingNext, isLoadingPrevious, isLoadMessages, isScrollStart, isScrollEnd]
	);

	useEffect(() => {
		const scrollableElement = targetRefNext.current;

		if (scrollableElement) {
			scrollableElement.addEventListener('scroll', handleScroll);
		}

		// Очистка эффекта: удаляем обработчик события при размонтировании
		return () => {
			if (scrollableElement) {
				scrollableElement.removeEventListener('scroll', handleScroll);
			}
		};
	}, [handleScroll]); // Указываем handleScroll как зависимость

	useEffect(() => {
		checkingTheLock();
	}, []);

	const checkingTheLock = async () => {
		try {
			// 1. Получаем данные времени до которого будет действовать блокировка
			const response = await UserService.checkBlocked(store.user.id);

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

	const memoizedIndexMap = useMemo(() => {
		if (isMemoizedIndexMap) {
			const entries = Object.values(LocationEnum).filter((type): type is LocationEnum => typeof type === 'string');
			return entries.map((item, index) => ({ item: String(item), index }));
		}
		setMemoizedIndexMap(false);
	}, [isMemoizedIndexMap]);

	useEffect(() => {
		if (location) {
			if (sendMessageId) {
				loadMessages(sendMessageId, location);
			} else {
				const endIdMessage: number | undefined = arrEndMessagesId?.reduce((accum, item, index) => {
					const indexLocation = memoizedIndexMap?.findIndex(({ item }) => item === location);
					if (indexLocation === index) {
						return accum + item.id;
					}
					return accum;
				}, 0);

				const postsFromLocation = posts?.filter((elem) => elem.location === location);
				if (endIdMessage && !postsFromLocation?.[0]?.postsCurrent) loadMessages(endIdMessage, location);
			}
		}
	}, [location, sendMessageId, arrEndMessagesId]);

	const loadMessages = async (endIdMessage: number, location: string) => {
		try {
			setIsLoadMessages(true);
			const allMessages = await MessagesService.getAllMessages(
				store.user.id,
				endIdMessage || -1,
				store.user.secret,
				location
			);
			if (allMessages)
				setPosts((prev) => {
					if (prev?.length) {
						const postsFromLocation = prev.filter((elem) => elem.location === location);
						const newListPosts = [
							...postsFromLocation,
							{ location, postsCurrent: [...Object.values(allMessages.data)] },
						];
						return [...prev, ...newListPosts];
					}
					return [{ location, postsCurrent: [...Object.values(allMessages.data)] }];
				});
			setIsLoadMessages(false);
		} catch (err) {
			setIsLoadMessages(false);
			console.error(`Ошибка в loadMessages: ${err}`);
		}
	};

	const loadPreviousMessages = async () => {
		try {
			setIsLoadingPrevious(true);
			const postsFromLocation = posts?.filter((elem) => elem.location === location);
			if (postsFromLocation && postsFromLocation[0]?.postsCurrent[0].id) {
				const newPosts = await MessagesService.getPreviousMessages(
					store.user.id,
					postsFromLocation[0].postsCurrent[0].id,
					store.user.secret,
					location
				);
				if (Array.isArray(newPosts.data) && !newPosts.data.length) {
					return setIsScrollStart((prev) => {
						if (location) return { ...prev, [location]: true };
					});
				}

				if (newPosts && newPosts.data)
					setPosts((prev) => {
						if (prev?.length) {
							const postsFromLocation = prev.filter((elem) => elem.location === location);
							if (postsFromLocation.length) {
								const newListPosts = [...Object.values(newPosts.data), ...postsFromLocation[0].postsCurrent];
								return prev.map((postsInLocation) =>
									postsInLocation.location === location
										? { ...postsInLocation, postsCurrent: newListPosts }
										: postsInLocation
								);
							}
						}
						return prev;
					});
			}
		} catch (err) {
			console.error(`Ошибка в loadPreviousMessages: ${err}`);
		} finally {
			setIsLoadingPrevious(false);
		}
	};

	const loadNextMessages = async () => {
		try {
			setIsLoadingNext(true);
			const postsFromLocation = posts?.filter((elem) => elem.location === location);
			if (postsFromLocation && postsFromLocation[0]?.postsCurrent[postsFromLocation[0].postsCurrent.length - 1].id) {
				const newMessages = await MessagesService.getNextMessages(
					store.user.id,
					postsFromLocation[0].postsCurrent[postsFromLocation[0].postsCurrent.length - 1].id,
					store.user.secret,
					location
				);

				if (Array.isArray(newMessages.data) && !newMessages.data.length) {
					return setIsScrollEnd((prev) => {
						if (location) return { ...prev, [location]: true };
					});
				}
				if (newMessages)
					setPosts((prev) => {
						if (prev?.length && newMessages.data) {
							const postsFromLocation = prev.filter((elem) => elem.location === location);
							if (postsFromLocation.length) {
								const newListPosts = [...postsFromLocation[0].postsCurrent, ...Object.values(newMessages.data)];
								return prev.map((postsInLocation) =>
									postsInLocation.location === location
										? { ...postsInLocation, postsCurrent: newListPosts }
										: postsInLocation
								);
							}
						}
						return prev;
					});
			}
		} catch (err) {
			console.error(`Ошибка в loadNextMessages: ${err}`);
		} finally {
			setIsLoadingNext(false);
		}
	};

	const nameLocal = useMemo(() => {
		let name = '';
		switch (location) {
			case 'locality':
				name = store.user.residency.locality;
				break;
			case 'region':
				name = store.user.residency.region;
				break;
			case 'country':
				name = store.user.residency.country;
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
								location={location}
								refPrev={targetRefPrev}
								refNext={targetRefNext}
								onScroll={handleScroll}
							/>
						)}
						<div id="messages">
							{timeRemaining !== null ? (
								<div className={styles['blocked_text']}>
									<p>Вы заблокированы за нарушение правил.</p>
									<p> Блокировка заканчивается {timeRemaining}</p>
								</div>
							) : (
								<>
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
