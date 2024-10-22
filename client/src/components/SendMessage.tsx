import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { IFiles } from '../models/IFiles';
import { useStoreContext } from '../contexts/StoreContext';
import { message } from 'antd';
import { useMessageContext } from '../contexts/MessageContext.ts';

interface Props {
	location: string;
}

function SendMessage(props: Props) {
	const [messageSent, setMessageSent] = useState<string>('');

	const { store } = useStoreContext();

	const { setSendMessageId } = useMessageContext();

	useEffect(() => {
		setMessageSent('');
		store.resetFiles();
	}, [props.location]);

	const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();

			const form = e.currentTarget;

			const formData = new FormData(form);

			const arrIdFiles = store.files.map((file: IFiles) => file.id);
			formData.append('files', JSON.stringify(arrIdFiles));

			const formJson = Object.fromEntries(formData.entries());

			const resp_id = await store.sendMessage(store.user.id, store.user.secret, props.location, formJson);
			if (resp_id.error && !resp_id.data) {
				return message.error(resp_id.error)
			} else if (resp_id.data) {
				setSendMessageId(+resp_id.data);
			}

			setMessageSent('');
			store.setNewMessage(true);
			store.resetFiles();
		} catch (err) {
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
				<textarea
					id="message"
					name="message"
					placeholder="Введите сообщение"
					value={messageSent}
					onChange={(e) => setMessageSent(e.target.value)}
					required
				/>
			</div>
			<div className="class_none">
				<p id="clip_files"></p>
			</div>
			<div className="send">
				<button type="submit" className="submit-send"></button>
			</div>
		</form>
	);
}

export default observer(SendMessage);
