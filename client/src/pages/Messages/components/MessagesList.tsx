import { Link } from 'react-router-dom';
import {
	DOMEN,
	FOUL_MESSAGES,
	LOCAL_STORAGE_END_READ_MESSAGE_ID,
	LocationEnum,
	PERSONALE_CARD_ROUTE,
} from '../../../utils/consts';
import { Buffer } from 'buffer';
import { createRef, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useStoreContext } from '../../../contexts/StoreContext.ts';
import { EndReadMessagesId } from '../../../models/endReadMessagesId.ts';
import MessagesService from '../../../services/MessagesService.ts';
import { useMessageContext } from '../../../contexts/MessageContext.ts';
import { message, Select, Spin } from 'antd';
import styles from './MessagesList.module.css';
import FoulModal from '../FoulModal/FoulModal.tsx';
import AdminService from '../../../services/AdminService.ts';

interface Props {
	location: string;
	refNext?: React.Ref<HTMLDivElement>;
	refPrev?: React.Ref<HTMLDivElement>;
	onScroll: () => void;
}

const MessagesList = forwardRef<HTMLDivElement, Props>(({ location, refPrev, refNext, onScroll }, ref) => {
	const [heights, setHeights] = useState<number>();
	const [endIdFromPage, setEndIdFromPage] = useState<EndReadMessagesId[]>();
	const [idFoulMessage, setIdFoulMessage] = useState<number>();
	const [isFoulModalOpenOk, setIsFoulModalOpenOk] = useState(false);
	const [isScrolling, setIsScrolling] = useState(false);
	let scrollTimeout: NodeJS.Timeout;

	const { store } = useStoreContext();

	const {
		sendMessageId,
		setSendMessageId,
		arrEndMessagesId,
		posts,
		isLoadMessages,
		isLoadingPrevious,
		isLoadingNext,
		getCountMessages,
	} = useMessageContext();

	const postsFromLocation = posts?.filter((elem) => elem.location === location);
	const postsCurrent = postsFromLocation?.[0]?.postsCurrent;

	const elementsRef = useRef<React.RefObject<HTMLDivElement>[] | null>(
		postsCurrent ? postsCurrent.map(() => createRef<HTMLDivElement>()) : null
	);

	const handleScroll = () => {
		if (scrollTimeout) {
			clearTimeout(scrollTimeout);
		}

		setIsScrolling(true);

		scrollTimeout = setTimeout(() => {
			setIsScrolling(false);
		}, 150); // 150 мс - время, через которое считаем, что прокрутка остановилась
	};

	useEffect(() => {
		document.getElementById('div__messages')?.addEventListener('scroll', handleScroll);

		return () => {
			document.getElementById('div__messages')?.removeEventListener('scroll', handleScroll);
			if (scrollTimeout) {
				clearTimeout(scrollTimeout);
			}
		};
	}, []);

	useEffect(() => {
		elementsRef.current = postsCurrent
			? postsCurrent.map(() => createRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>)
			: null;
	}, [postsCurrent, location]);

	const memoizedIndexMap = useMemo(() => {
		const entries = Object.values(LocationEnum).filter((type): type is LocationEnum => typeof type === 'string');
		return entries.map((item, index) => ({ item: String(item), index }));
	}, []);

	useEffect(() => {
		if (!location || !endIdFromPage?.length || !elementsRef.current?.length) return;
		let i = 0;
		elementsRef.current.reduce((accum, ref) => {
			if (ref.current && heights && accum < heights - 70) {
				i++;
				return accum + ref.current.clientHeight;
			}
			return accum;
		}, 0);
		const newEndIdFromPage = endIdFromPage.map((elem, index) => {
			const indexLocation = memoizedIndexMap.findIndex(({ item }) => item === location);
			if (index === indexLocation && i !== 0) {
				const currentElement = elementsRef.current?.[i - 1]?.current;
				return {
					...elem,
					id: currentElement?.id ? +currentElement?.id : 0,
				};
			}
			return elem;
		});

		setEndIdFromPage((prev) => {
			if (prev && JSON.stringify(prev) !== JSON.stringify(newEndIdFromPage)) {
				return newEndIdFromPage;
			}
			return prev;
		});
	}, [heights]);

	useEffect(() => {
		if (!location || !endIdFromPage?.length || !sendMessageId) return;
		const newEndIdFromPage = endIdFromPage.map((elem, index) => {
			const indexLocation = memoizedIndexMap.findIndex(({ item }) => item === location);
			if (index === indexLocation) {
				return {
					...elem,
					id: sendMessageId,
				};
			}
			return elem;
		});

		setEndIdFromPage((prev) => {
			if (prev && JSON.stringify(prev) !== JSON.stringify(newEndIdFromPage)) {
				return newEndIdFromPage;
			}
			return prev;
		});
		setSendMessageId(undefined);
	}, [sendMessageId]);

	useEffect(() => {
		if (endIdFromPage?.length) {
			localStorage.setItem(LOCAL_STORAGE_END_READ_MESSAGE_ID, JSON.stringify(endIdFromPage));
		}
		endIdFromPage?.map((elem, index) => {
			if (elem && arrEndMessagesId?.length) {
				if (store.user.id && elem.id > arrEndMessagesId[index].id) {
					updateEndReadMessagesIdInBackEnd(store.user.id, elem.id, elem.location, store.user.secret);
				}
			}
		});
	}, [endIdFromPage]);

	const updateEndReadMessagesIdInBackEnd = async (
		user_id: number,
		message_id: number,
		location: string,
		secret: string
	) => {
		try {
			if (isScrolling) {
				await MessagesService.setEndReadMessagesId(user_id, message_id, location, secret);
				getCountMessages();
			}
		} catch (error) {
			console.error(`Ошибка в updateEndReadMessagesIdInBackEnd: ${error}`);
		}
	};

	useEffect(() => {
		const storageId = localStorage.getItem(LOCAL_STORAGE_END_READ_MESSAGE_ID);

		if (storageId && !endIdFromPage?.length) {
			setEndIdFromPage(JSON.parse(storageId) as EndReadMessagesId[]);
		}
		if (!storageId && arrEndMessagesId?.length) {
			setEndIdFromPage(arrEndMessagesId);
		}
	}, [arrEndMessagesId?.length]);

	useEffect(() => {
		const storageId = localStorage.getItem(LOCAL_STORAGE_END_READ_MESSAGE_ID);

		if (storageId && elementsRef.current?.length) {
			const endIdStorage = JSON.parse(storageId) as EndReadMessagesId[];
			endIdStorage?.map((elem, index) => {
				const indexLocation = memoizedIndexMap.findIndex(({ item }) => item === location);
				if (index === indexLocation) {
					const divId = document.getElementById(`${elem.id}`);
					if (divId) divId.scrollIntoView({ block: 'end' });
				}
			});
		}
	}, [elementsRef.current]);

	var options_time: {} = {
		timezone: 'UTC',
		hour: 'numeric',
		minute: 'numeric',
	};

	var options_day: {} = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timezone: 'UTC',
	};

	const onFoulMessageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setIdFoulMessage(+event);
		setIsFoulModalOpenOk(true);
	};

	useEffect(() => {
		const messagesElement = document.getElementById('div__messages');
		if (messagesElement) {
			const scrollTop = messagesElement.scrollTop;
			const clientHeight = messagesElement.clientHeight;
			setHeights(scrollTop + clientHeight);
		}
	}, [elementsRef.current]);

	useEffect(() => {
		document.getElementById('div__messages')?.addEventListener('scroll', scrollHandler);

		return () => {
			document.getElementById('div__messages')?.removeEventListener('scroll', scrollHandler);
		};
	});

	const scrollHandler = (e: Event) => {
		const target = e.target as HTMLElement;
		const { scrollTop, clientHeight } = target;
		setHeights(scrollTop + clientHeight);
	};

	const sendFoul = async (selectedRules: number[], selectedActionWithFoul: number, selectedPunishment: number) => {
		if (idFoulMessage) {
			try {
				const sendFoulMessage = await AdminService.reportViolation({
					id_cleaner: store.user.id,
					id_foul_message: idFoulMessage,
					selectedRules: selectedRules,
					selectedActionWithFoul: selectedActionWithFoul,
					selectedPunishment: selectedPunishment,
				});

				if (sendFoulMessage) message.success(`${sendFoulMessage.data}`);
			} catch (err) {
				console.error(`Ошибка в sendFoul: ${err}`);
			}
		}
	};

	return (
		<div ref={ref} onScroll={onScroll} className="main__text" id="div__messages">
			{isLoadMessages && (
				<div className={styles['scroll_messages']} style={{ height: ' 100%' }}>
					<Spin />
				</div>
			)}
			<div id="message__ajax">
				<div ref={refPrev} className={styles['scroll_messages']} style={{ height: '20px' }}>
					{isLoadingPrevious && <Spin />}
				</div>
				{!isLoadMessages &&
					postsCurrent?.map((post, index, arr) => (
						<div key={post.id} id={`${post.id}`} ref={elementsRef.current?.[index]}>
							{index === 0 ? (
								<div className="date__wrapper">
									<p className="name__time">{new Date(post.createdAt).toLocaleString('ru', options_day)}</p>
								</div>
							) : (
								new Date(post.createdAt).toDateString() !==
									new Date(arr[index === 0 ? index : index - 1].createdAt).toDateString() && (
									<div className="date__wrapper">
										<p className="name__time">{new Date(post.createdAt).toLocaleString('ru', options_day)}</p>
									</div>
								)
							)}

							<div className="mes__wrapper">
								<Link to={`${PERSONALE_CARD_ROUTE}/${post.user.id}`}>
									<img className="mes_foto" src={post.user.photo_50} />
								</Link>
								<div className="name__first_last">
									<Link to={`${PERSONALE_CARD_ROUTE}/${post.user.id}`} className="name__first">
										<p className="name__first">{post.user.first_name}</p>
									</Link>
									<Link to={`${PERSONALE_CARD_ROUTE}/${post.user.id}`} className="name__first">
										<p className="name__first">{post.user.last_name}</p>
									</Link>
									<p className="name__time">{new Date(post.createdAt).toLocaleString('ru', options_time)}</p>
									<div className="foul">
										<Select
											onSelect={(e) => onFoulMessageChange(e)}
											className={styles['select-foul']}
											options={[FOUL_MESSAGES].map((item) => ({
												label: item,
												value: post.id,
											}))}
										/>
									</div>
								</div>
								<div className="mes_message">{post.message.trim()}</div>
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
							</div>
						</div>
					))}
			</div>
			<div ref={refNext} className={styles['scroll_messages']} style={{ height: '20px' }}>
				{isLoadingNext && <Spin />}
			</div>
			<div id="button__message">
				<button
					id="button"
					// onClick={openNewMesseg}
				>
					У вас есть непрочитанные сообщения. Показать?
				</button>
			</div>
			<FoulModal
				isFoulModalOpenOk={isFoulModalOpenOk}
				sendFoul={sendFoul}
				onCancel={() => setIsFoulModalOpenOk(false)}
			/>
		</div>
	);
});

export default MessagesList;
