import { useEffect, useRef } from 'react';
import { useStoreContext } from '../../../contexts/StoreContext.ts';
import { Spin } from 'antd';
import styles from '../GroupPage.module.css';
import { observer } from 'mobx-react-lite';
import PostInChatGroup from '../../../components/Post/PostInChatGroup.tsx';
import { useGroupContext } from '../../../contexts/GroupContext.ts';
import { GroupMessage } from '../../../services/GroupsService.ts';

interface Props {
	posts: GroupMessage[];
	location: string;
	lastMessageRef?: React.Ref<HTMLDivElement>;
	messagesRef?: React.Ref<HTMLDivElement>;
	groupId: number;
	deletePost: (id: number, location: string) => void;
}

const GroupPostsList: React.FC<Props> = ({ posts, location, messagesRef, lastMessageRef, deletePost, groupId }) => {
	const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Таймер для остановки прокрутки

	const readMessagesRef = useRef<Set<number>>(new Set()); // Ссылки на прочитанные сообщения
	const lastReadMessageIdRef = useRef<number>(0); // id последнего прочитанного сообщения

	const postsRefs = useRef<HTMLDivElement[]>([]);

	const { store } = useStoreContext();
	const {
		arrLastReadPostsGroupsId,
		updateEndReadPostsGroupsIdInBackEnd,
		arrCountNoReadPostsGroups,
		updateArrCountNoReadPostsGroups,
	} = store.groupStore;

	const { isLoadGroups, setIsScrollTop, groupsContainerRef } = useGroupContext();

	const noReadMessagesCount = arrCountNoReadPostsGroups.find((g) => g.groupId === groupId)?.count ?? 0;

	const lastReadMessagesId = arrLastReadPostsGroupsId.find((g) => g.groupId === groupId)?.lastReadPostId;

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
			const backendLastRead = arrLastReadPostsGroupsId.find((g) => g.groupId === groupId)?.lastReadPostId ?? 0;

			if (lastReadMessageIdRef.current > backendLastRead) {
				updateEndReadPostsGroupsIdInBackEnd(groupId, lastReadMessageIdRef.current);
			}
		}, 500);
		// Задержка в 500 мс
	};

	// Сброс счётчиков при сменен группы
	useEffect(() => {
		readMessagesRef.current.clear();
		lastReadMessageIdRef.current = lastReadMessagesId ?? 0;
	}, [groupId]);

	// Intersection Observer для отслеживания видимости сообщений
	useEffect(() => {
		if (!postsRefs.current.length) return;

		const container = document.getElementById('div__messages');

		const observer = new IntersectionObserver(
			(entries) => {
				let decremented = 0;

				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const messageId = Number(entry.target.getAttribute('post-id'));

						if (lastReadMessagesId && messageId > lastReadMessagesId && !readMessagesRef.current.has(messageId)) {
							readMessagesRef.current.add(messageId);

							if (messageId > lastReadMessageIdRef.current) {
								lastReadMessageIdRef.current = messageId;
							}

							decremented++;
						}
					}
				});

				if (decremented > 0) {
					updateArrCountNoReadPostsGroups(groupId, Math.max(0, noReadMessagesCount - decremented), location);
				}
			},
			{
				root: container,
				threshold: 0.5, // Сообщение считается видимым, если 50% его площади в зоне видимости
			}
		);

		postsRefs.current.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	}, [posts, location]);

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
		<div className="main__text" id="div__messages" ref={groupsContainerRef}>
			{isLoadGroups && (
				<div className={styles['scroll_messages']}>
					<Spin />
				</div>
			)}

			<div id="message__ajax" ref={messagesRef}>
				{posts?.map((post, index, arr) => {
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

							<PostInChatGroup post={post} deletePost={deletePost} />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default observer(GroupPostsList);
