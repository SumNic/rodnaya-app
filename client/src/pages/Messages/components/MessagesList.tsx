import { useEffect, useRef, useState } from 'react';
import { useStoreContext } from '../../../contexts/StoreContext.ts';
import { useMessageContext } from '../../../contexts/MessageContext.ts';
import { Spin } from 'antd';
import styles from './MessagesList.module.css';
import { observer } from 'mobx-react-lite';
import PostInMessage from '../../../components/Post/PostInMessages.tsx';
import { MessageWithPartialUser } from '../../../models/IMessages.ts';

interface Props {
	posts: MessageWithPartialUser[];
	location: string;
	lastMessageRef?: React.Ref<HTMLDivElement>;
	messagesRef?: React.Ref<HTMLDivElement>;
	groupId?: number;
	deletePost: (id: number) => void;
}

interface Page {
	locality: number;
	region: number;
	country: number;
	world: number;
}

const indexLocation: Page = {
	locality: 0,
	region: 1,
	country: 2,
	world: 3,
};

const MessagesList: React.FC<Props> = ({ posts, location, messagesRef, lastMessageRef, deletePost }) => {
	const [lastReadMessagesId, setLastReadMessagesId] = useState<number>();
	const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Таймер для остановки прокрутки
	const lastReadMessageIdRef = useRef<number>(0);
	const postsRefs = useRef<HTMLDivElement[]>([]);
	const nameLocalRef = useRef<string>('');
	const seenMessageIdsRef = useRef<Set<number>>(new Set());

	const { store } = useStoreContext();
	const {
		arrLastReadMessagesId,
		updateEndReadMessagesIdInBackEnd,
		arrCountNoReadMessages,
		updateArrCountNoReadMessages,
	} = store.messageStore;
	const { user } = store.authStore;

	const { isLoadMessages, setIsScrollTop, messagesContainerRef } = useMessageContext();

	switch (location) {
		case 'locality':
			nameLocalRef.current = user.residency.locality || '';
			break;
		case 'region':
			nameLocalRef.current = user.residency.region || '';
			break;
		case 'country':
			nameLocalRef.current = user.residency.country || '';
			break;
		case 'world':
			nameLocalRef.current = 'Земля';
			break;
	}

	useEffect(() => {
		lastReadMessageIdRef.current = 0;
		if (posts && location) setLastReadMessagesId(arrLastReadMessagesId[indexLocation[location as keyof Page]]?.id);
	}, [location, posts]);

	const handleScroll = () => {
		if (document.getElementById('div__messages')?.scrollTop === 0) {
			setIsScrollTop(true);
		}

		// Сбрасываем таймер при каждом движении прокрутки
		if (scrollTimeoutRef.current) {
			clearTimeout(scrollTimeoutRef.current);
		}

		// Устанавливаем таймер для определения остановки прокрутки
		scrollTimeoutRef.current = setTimeout(() => {
			if (lastReadMessagesId && lastReadMessageIdRef.current > lastReadMessagesId) {
				updateEndReadMessagesIdInBackEnd(lastReadMessageIdRef.current, nameLocalRef.current);
			}
		}, 500); // Задержка в 500 мс
	};

	// Intersection Observer для отслеживания видимости сообщений
	useEffect(() => {
		if (!postsRefs.current.length) return;

		const container = messagesContainerRef.current;
		if (!container) return;

		const observer = new IntersectionObserver(
			(entries) => {
				let decremented = 0;

				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;

					const messageId = Number(entry.target.getAttribute('post-id'));
					if (!messageId) return;

					// ❗ уже учитывали — пропускаем
					if (seenMessageIdsRef.current.has(messageId)) return;

					// ❗ сообщение реально новое
					if (lastReadMessagesId && messageId > lastReadMessagesId && messageId > lastReadMessageIdRef.current) {
						seenMessageIdsRef.current.add(messageId);
						lastReadMessageIdRef.current = messageId;
						decremented++;
					}
				});

				const noReadMessagesCount = arrCountNoReadMessages[indexLocation[location as keyof Page]]?.count;

				// ⬇ уменьшаем счётчик ОДИН раз
				if (decremented > 0) {
					updateArrCountNoReadMessages(nameLocalRef.current, Math.max(0, noReadMessagesCount - decremented));
				}
			},
			{
				root: container,
				threshold: 0.5,
			}
		);

		postsRefs.current.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	}, [posts.length, location]);

	useEffect(() => {
		document.getElementById('div__messages')?.addEventListener('scroll', handleScroll);

		handleScroll();

		return () => {
			document.getElementById('div__messages')?.removeEventListener('scroll', handleScroll);
		};
	}, [location]);

	var options_day: {} = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timezone: 'UTC',
	};

	return (
		<div className="main__text" id="div__messages" ref={messagesContainerRef}>
			{isLoadMessages && (
				<div className={styles['scroll_messages']}>
					<Spin />
				</div>
			)}

			<div id="message__ajax" ref={messagesRef}>
				{posts.map((post, index, arr) => {
					const prevCreateAt = arr[index === 0 ? index : index - 1].createdAt!;
					return (
						<div
							className={styles.posts}
							key={post.id}
							post-id={`${post.id}`}
							ref={(el) => {
								if (!el) return; // элемент может быть null при размонтировании
								postsRefs.current[index] = el; // сохраняем в массив всех сообщений
								if (index === posts.length - 1 && lastMessageRef) {
									(lastMessageRef as React.MutableRefObject<HTMLDivElement>).current = el; // сохраняем последний
								}
							}}
						>
							{index === 0 ? (
								<div className="date__wrapper">
									<p className="name__time">
										{post.createdAt && new Date(post.createdAt).toLocaleString('ru', options_day)}
									</p>
								</div>
							) : (
								post.createdAt &&
								new Date(post.createdAt).toDateString() !== new Date(prevCreateAt).toDateString() && (
									<div className="date__wrapper">
										<p className="name__time">{new Date(post.createdAt).toLocaleString('ru', options_day)}</p>
									</div>
								)
							)}

							<PostInMessage post={post} deletePost={deletePost} />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default observer(MessagesList);
