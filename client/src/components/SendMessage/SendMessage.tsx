import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { IFiles } from '../../models/IFiles.ts';
import { useStoreContext } from '../../contexts/StoreContext.ts';
import { message, Spin } from 'antd';
import { useMessageContext } from '../../contexts/MessageContext.ts';
import { useSocket } from '../../hooks/useSocket.ts';
import { MessageWebsocketResponse } from '../../models/response/MessageWebsocketResponse.ts';

import styles from './SendMessage.module.css';
import { LoadingOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';

interface SendMessageProps {
	location: string;
	groupId?: number | undefined;
	videoUrls: string[];
	setVideoUrls: React.Dispatch<React.SetStateAction<string[]>>;
	setShowVideoInput: React.Dispatch<React.SetStateAction<boolean>>;
}

const SendMessage: React.FC<SendMessageProps> = ({ location, groupId, videoUrls, setVideoUrls, setShowVideoInput }) => {
	const [messageSent, setMessageSent] = useState<string>('');
	const [isSendMessage, setIsSendMessage] = useState(false);

	const { socket } = useSocket();

	const { store } = useStoreContext();
	const { sendMessage } = store.messageStore;
	const { sendPostToChat } = store.groupStore;

	const { setMessageDataSocket } = useMessageContext();

	useEffect(() => {
		const handleNewMessage = (data: MessageWebsocketResponse) => {
			if (!data) return;
			setMessageDataSocket(data);
		};

		socket?.on('new_message', handleNewMessage);

		// Очистка при размонтировании
		return () => {
			socket?.off('new_message', handleNewMessage);
		};
	}, [socket]);

	useEffect(() => {
		setMessageSent('');
		store.filesStore.resetFiles();
	}, [location, groupId]);

	const sendMessageToBackend = async (e: React.FormEvent<HTMLFormElement>) => {
		setIsSendMessage(true);
		try {
			e.preventDefault();

			const arrIdFiles = store.filesStore.files.map((file: IFiles) => ({
				id: file.id,
				fileName: file.fileName,
				fileNameUuid: file.fileNameUuid,
			}));

			const resp_id = groupId
				? await sendPostToChat({
						groupId,
						location,
						form: {
							message: messageSent.trim(),
							files: arrIdFiles,
							video: videoUrls.length ? videoUrls : undefined, // видео может быть необязательным
						},
					})
				: await sendMessage({
						location,
						form: {
							message: messageSent.trim(),
							files: arrIdFiles,
							video: videoUrls.length ? videoUrls : undefined, // видео может быть необязательным
						},
					});
			if (resp_id.error) {
				return message.error(resp_id.error);
			}

			setMessageSent('');
			store.filesStore.resetFiles();
			setVideoUrls([]);
			setShowVideoInput(false);
			setIsSendMessage(false);
		} catch (err) {
			setIsSendMessage(false);
			message.error(` Ошибка в sendMessage: ${err}`);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
		if (messageSent.trim().length > 0 && !e.shiftKey && e.key === 'Enter') {
			if (e.key === 'Enter') {
				e.preventDefault();
				sendMessageToBackend(e);
			}
		} else if (messageSent.trim() === '' && ((!e.shiftKey && e.key === 'Enter') || (e.shiftKey && e.key === 'Enter'))) {
			e.preventDefault();
			message.warning('Поле ввода не может быть пустым');
		}
	};

	return (
		<form name="send_message" id="send_message" method="post" onSubmit={sendMessageToBackend} onKeyDown={handleKeyDown}>
			<div className="message">
				<TextArea
					id="message"
					name="message"
					placeholder="Введите сообщение"
					value={messageSent}
					onChange={(e) => setMessageSent(e.target.value)}
					required
					style={{ overflow: 'hidden' }}
					disabled={isSendMessage}
				/>
			</div>
			{/* <div className="class_none">
				<p id="clip_files"></p>
			</div> */}
			{isSendMessage ? (
				<Spin className={styles.send} indicator={<LoadingOutlined style={{ color: '#b1b3b1', fontSize: 30 }} spin />} />
			) : (
				<div className={styles.send}>
					<button type="submit" className={styles.submit_send}></button>
				</div>
			)}
		</form>
	);
};

export default observer(SendMessage);
