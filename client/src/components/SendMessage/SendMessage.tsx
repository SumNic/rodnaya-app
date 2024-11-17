import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { IFiles } from '../../models/IFiles.ts';
import { useStoreContext } from '../../contexts/StoreContext.ts';
import { message, Spin } from 'antd';
import { useMessageContext } from '../../contexts/MessageContext.ts';
import { useSocket } from '../../hooks/useSocket.ts';
import { MessageWebsocketResponse } from '../../models/response/MessageWebsocketResponse.ts';

import styles from './SendMessage.module.css'
import { LoadingOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';

interface Props {
	location: string;
}

function SendMessage(props: Props) {
	const [messageSent, setMessageSent] = useState<string>('');
	const [ isSendMessage, setIsSendMessage ] = useState(false);

	const { socket } = useSocket();

	const { store } = useStoreContext();

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
		store.resetFiles();
	}, [props.location]);

	const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		setIsSendMessage(true)
		try {
			e.preventDefault();

			const form = e.currentTarget;
			const formData = new FormData(form);

			const arrIdFiles = store.files.map((file: IFiles) => file);
			formData.append('files', JSON.stringify(arrIdFiles));
			const formJson = Object.fromEntries(formData.entries());

			const dto = {
				id_user: store.user.id,
				secret: store.user.secret,
				location: props.location,
				form: formJson
			}

			const resp_id = await store.sendMessage(dto);
			if (resp_id.error) {
				return message.error(resp_id.error);
			}

			setMessageSent('');
			store.resetFiles();
			setIsSendMessage(false)
		} catch (err) {
			setIsSendMessage(false)
			message.error(` Ошибка в sendMessage: ${err}`);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
		if (messageSent.trim().length > 0 && !e.shiftKey && e.key === 'Enter') {
			if (e.key === 'Enter') {
				e.preventDefault();
				sendMessage(e);
			}
		} else if (messageSent.trim() === '' && ((!e.shiftKey && e.key === 'Enter') || (e.shiftKey && e.key === 'Enter'))) {
			e.preventDefault();
			message.warning('Поле ввода не может быть пустым');
		}
	};

	return (
		<form name="send_message" id="send_message" method="post" onSubmit={sendMessage} onKeyDown={handleKeyDown}>
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
			{isSendMessage ? <Spin  className={styles.send} indicator={<LoadingOutlined style={{ color: '#b1b3b1', fontSize: 30 }} spin />}/> : <div className={styles.send}>
				<button type="submit" className={styles.submit_send}></button>
			</div>}
		</form>
	);
}

export default observer(SendMessage);
