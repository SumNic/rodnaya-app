import { useEffect, useRef, useState } from 'react';
import { useStoreContext } from '../../../contexts/StoreContext.ts';
import { useMessageContext } from '../../../contexts/MessageContext.ts';
import { Spin } from 'antd';
import styles from './MessagesList.module.css';
import { observer } from 'mobx-react-lite';
// import { IPosts } from '../../../models/IPostsGroup.ts';
import { Page } from './Messages.tsx';
import PostForMessage from '../../../components/Post/PostForMessage.tsx';
import { IMessages } from '../../../models/IMessages.ts';
// import { IPostsMessage } from '../../../models/Messages.ts';
// import { Page } from '../MessagesPage.tsx';

interface Props {
	posts: IMessages & { createdAt?: Date };
	location: string;
	lastMessageRef?: React.Ref<HTMLDivElement>;
	messagesRef?: React.Ref<HTMLDivElement>;
	groupId?: number;
}

const indexLocation: Page = {
	locality: 0,
	region: 1,
	country: 2,
	world: 3,
};

const initialValue: Page = {
	locality: 0,
	region: 0,
	country: 0,
	world: 0,
};

const MessagesList: React.FC<Props> = ({ posts, location, messagesRef, lastMessageRef }) => {
	const [count, setCount] = useState<typeof initialValue>(initialValue);
	const [prevCount, setPrevCount] = useState<typeof initialValue>(initialValue);

	const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Таймер для остановки прокрутки

	const lastReadMessageIdRef = useRef<typeof initialValue>(initialValue);

	const nameLocalRef = useRef<string>('');

	const { store } = useStoreContext();
	const {
		arrLastReadMessagesId,
		updateEndReadMessagesIdInBackEnd,
		arrCountNoReadMessages,
		updateArrCountNoReadMessages,
	} = store.messageStore;
	const { user } = store.authStore;

	const { isLoadMessages, setIsScrollTop, messagesContainerRef } = useMessageContext();

	let locationKey: keyof IMessages = location as keyof IMessages;

	const postsFromLocation = posts[locationKey];

	const noReadMessagesCount = arrCountNoReadMessages[indexLocation[location as keyof Page]]?.count;

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
		if (noReadMessagesCount !== undefined) {
			const fixCount = noReadMessagesCount + prevCount[locationKey];
			updateArrCountNoReadMessages(nameLocalRef.current, fixCount - count[locationKey]);
			setPrevCount((prev) => ({ ...prev, [locationKey]: count[locationKey] }));
		}
	}, [count]);

	useEffect(() => {}, [noReadMessagesCount]);

	const lastReadMessagesId = arrLastReadMessagesId[indexLocation[location as keyof Page]]?.id;

	const handleScroll = () => {
		const lastReadMessagesId = arrLastReadMessagesId[indexLocation[location as keyof Page]]?.id;

		if (document.getElementById('div__messages')?.scrollTop === 0) {
			setIsScrollTop(true);
		}

		// Сбрасываем таймер при каждом движении прокрутки
		if (scrollTimeoutRef.current) {
			clearTimeout(scrollTimeoutRef.current);
		}

		// Устанавливаем таймер для определения остановки прокрутки
		scrollTimeoutRef.current = setTimeout(() => {
			if (lastReadMessageIdRef.current[locationKey] > lastReadMessagesId) {
				updateEndReadMessagesIdInBackEnd(lastReadMessageIdRef.current[locationKey], nameLocalRef.current);
			}
		}, 500); // Задержка в 500 мс
	};

	// Intersection Observer для отслеживания видимости сообщений
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const messageId = Number(entry.target.getAttribute('post-id'));

						// Если сообщение видно и его ID больше последнего прочитанного
						if (messageId > lastReadMessageIdRef.current[locationKey] && messageId > lastReadMessagesId) {
							lastReadMessageIdRef.current[locationKey] = messageId; // Обновляем ref
							setCount((prevCount) => ({ ...prevCount, [locationKey]: prevCount[locationKey] + 1 }));
						}
					}
				});
			},
			{
				threshold: 0.5, // Сообщение считается видимым, если 50% его площади в зоне видимости
			}
		);

		// Наблюдаем за всеми сообщениями
		const messageElements = document.querySelectorAll('.posts');
		messageElements.forEach((element) => observer.observe(element));

		return () => {
			observer.disconnect();
		};
	}, [postsFromLocation, location]);

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
				{postsFromLocation?.map((post, index, arr) => {
					const prevCreateAt = arr[index === 0 ? index : index - 1].createdAt!;
					return (
						<div
							className={styles.posts}
							key={post.id}
							post-id={`${post.id}`}
							ref={index === postsFromLocation.length - 1 && lastMessageRef ? lastMessageRef : null}
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

							<PostForMessage post={post} />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default observer(MessagesList);
