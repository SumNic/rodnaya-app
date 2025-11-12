import Post from '../../../components/Post/Post.tsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Spin } from 'antd';

import styles from './PublicationsList.module.css';
import { PublicationWithPartialUser } from '../Publications.tsx';

interface Props {
	publications: PublicationWithPartialUser[] | undefined;
	isLoadPublications: boolean;
	lastPublicationRef?: React.Ref<HTMLDivElement>;
}

const PublicationsList: React.FC<Props> = ({ publications, isLoadPublications, lastPublicationRef }) => {
	var options_day: {} = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timezone: 'UTC',
	};

	return (
		<div className={styles.publications} id="div__messages">
			{isLoadPublications && (
				<div className={styles['scroll_messages']}>
					<Spin />
				</div>
			)}
			<div id="message__ajax">
				{publications?.map((post, index, arr) => {
					const postDate = post.createdAt && new Date(post.createdAt);
					const prevCreatedAt = arr[index - 1]?.createdAt;

					const prevPostDate =
						prevCreatedAt instanceof Date
							? prevCreatedAt
							: prevCreatedAt
								? new Date(prevCreatedAt) // если это строка или число
								: null;

					const today = new Date();

					// Проверяем, совпадает ли дата с сегодняшним днём
					const isToday =
						postDate?.getDate() === today.getDate() &&
						postDate.getMonth() === today.getMonth() &&
						postDate.getFullYear() === today.getFullYear();

					return (
						<div
							key={post.id}
							id={`${post.id}`}
							ref={index === publications.length - 1 && lastPublicationRef ? lastPublicationRef : null}
						>
							{index === 0 || (prevPostDate && postDate?.toDateString() !== prevPostDate.toDateString()) ? (
								<div className="date__wrapper">
									<p className="name__time">{isToday ? 'Сегодня' : postDate?.toLocaleString('ru', options_day)}</p>
								</div>
							) : null}

							<Post post={post} />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default observer(PublicationsList);
