import { Link } from 'react-router-dom';
import {
	DOMEN,
	FOUL_MESSAGES,
	LOCAL_STORAGE_END_READ_MESSAGE_ID,
	LocationEnum,
	PERSONALE_CARD_ROUTE,
} from '../../../utils/consts';
import { Buffer } from 'buffer';
import { createRef, useEffect, useMemo, useRef, useState } from 'react';
import { useStoreContext } from '../../../contexts/StoreContext.ts';
import { EndReadMessagesId } from '../../../models/endReadMessagesId.ts';
import MessagesService from '../../../services/MessagesService.ts';
import { useMessageContext } from '../../../contexts/MessageContext.ts';
import { message, Select } from 'antd';
import styles from './MessagesList.module.css';
import { IPost } from '../../../models/IPost.ts';
import FoulModal from '../FoulModal/FoulModal.tsx';
import AdminService from '../../../services/AdminService.ts';

interface Props {
	posts: IPost[];
	location: string;
}

const MessagesList: React.FC<Props> = ({ posts, location }) => {
	const [heights, setHeights] = useState<number>();
	const [endIdFromPage, setEndIdFromPage] = useState<EndReadMessagesId[]>();
	const [idFoulMessage, setIdFoulMessage] = useState<number>();
	const [isFoulModalOpenOk, setIsFoulModalOpenOk] = useState(false);

	const { store } = useStoreContext();

	const { sendMessageId } = useMessageContext();

	const elementsRef = useRef<React.RefObject<HTMLDivElement>[]>(
		posts.map(() => createRef() as React.RefObject<HTMLDivElement>)
	);

	useEffect(() => {
		elementsRef.current = posts.map(() => createRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>);
	}, [posts, location]);

	const memoizedIndexMap = useMemo(() => {
		const entries = Object.values(LocationEnum).filter((type): type is LocationEnum => typeof type === 'string');
		return entries.map((item, index) => ({ item: String(item), index }));
	}, []);

	useEffect(() => {
		if (!location || !endIdFromPage?.length || !elementsRef.current.length) return;
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
				const currentElement = elementsRef.current[i - 1]?.current;
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
	}, [sendMessageId]);

	useEffect(() => {
		if (endIdFromPage?.length) {
			localStorage.setItem(LOCAL_STORAGE_END_READ_MESSAGE_ID, JSON.stringify(endIdFromPage));
		}
		endIdFromPage?.map(async (elem, index) => {
			try {
				if (elem && store.arrEndMessagesId.length) {
					if (store.user.id && elem.id > store.arrEndMessagesId[index].id) {
						await MessagesService.setEndReadMessagesId(store.user.id, elem.id, elem.location, store.user.secret);
					}
				}
			} catch (e) {
				console.log(e, 'e');
			}
		});
	}, [endIdFromPage]);

	useEffect(() => {
		const storageId = localStorage.getItem(LOCAL_STORAGE_END_READ_MESSAGE_ID);

		if (storageId && !endIdFromPage?.length) {
			setEndIdFromPage(JSON.parse(storageId) as EndReadMessagesId[]);
		}
		if (!storageId && store.arrEndMessagesId.length) {
			setEndIdFromPage(store.arrEndMessagesId);
		}
	}, [store.arrEndMessagesId.length]);

	useEffect(() => {
		const storageId = localStorage.getItem(LOCAL_STORAGE_END_READ_MESSAGE_ID);

		if (storageId && elementsRef.current.length) {
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

	// useEffect(() => {
	//     window.addEventListener("beforeunload", handleWindowBeforeUnload);
	// });

	// function handleWindowBeforeUnload(e: any) {
	//     console.log(e, "e");
	// }

	const onFoulMessageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setIdFoulMessage(+event);
		setIsFoulModalOpenOk(true);
		console.log(event, 'event');
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
                    selectedPunishment: selectedPunishment
                })

                if (sendFoulMessage) message.success(`${sendFoulMessage.data}`)
            } catch (err) {
                console.error(`Ошибка в sendFoul: ${err}`)
            }
        }
	};

	return (
		<div className="main__text" id="div__messages">
			<div id="message__ajax">
				{posts.map((post, index, arr) => (
					<div key={post.id} id={`${post.id}`} ref={elementsRef.current[index]}>
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
										<a href={`${DOMEN}/${file.fileNameUuid}`} target="_blank" key={file.id} className="name__file">
											{originFileName}
										</a>
									);
								})}
							</div>
						</div>
					</div>
				))}
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
};

export default MessagesList;
