import { message, Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useRef, useState } from 'react';
import { IFiles } from '../../models/IFiles';
import UploadAntdFiles from '../UploadAntdFiles/UploadAntdFiles';
import { useStoreContext } from '../../contexts/StoreContext';

interface SendPublicationProps {
	handleCancel: () => void;
}

const SendPublication: React.FC<SendPublicationProps> = ({ handleCancel }) => {
	const [loading, setLoading] = useState<boolean>(false);

	const { store } = useStoreContext();

	const publicationTextRef = useRef<string>('');

	const cancel = () => {
		publicationTextRef.current = '';
		store.filesStore.resetFiles();
		handleCancel();
	};

	const handleSubmit = async () => {
		setLoading(true);

		try {
			const formData = new FormData();

			formData.append('message', publicationTextRef.current);

			const arrIdFiles = store.filesStore.files.map((file: IFiles) => file);
			formData.append('files', JSON.stringify(arrIdFiles));

			const dto = {
				id_user: store.authStore.user.id,
				secret: store.authStore.user.secret,
				form: Object.fromEntries(formData.entries()),
			};

			const response = await store.publicationStore.addPublication(dto);

			if (response.error) {
				message.error(response.error);
				return;
			}

			message.success('Публикация успешно добавлена!');
			cancel();
		} catch (error) {
			console.error('Ошибка в handleSubmit:', error);
		} finally {
			setLoading(false);
			cancel();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (publicationTextRef.current.trim().length > 0 && !e.shiftKey && e.key === 'Enter') {
			if (e.key === 'Enter') {
				e.preventDefault();
				handleSubmit();
			}
		} else if (
			publicationTextRef.current.trim() === '' &&
			((!e.shiftKey && e.key === 'Enter') || (e.shiftKey && e.key === 'Enter'))
		) {
			e.preventDefault();
			message.warning('Поле ввода не может быть пустым');
		}
	};

	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		publicationTextRef.current = e.target.value;
	};

	return (
		<>
			<TextArea
				rows={4}
				defaultValue={publicationTextRef.current}
				onChange={handleTextChange}
				placeholder="Введите сообщение"
				disabled={loading}
				onKeyDown={handleKeyDown}
			/>
			<div style={{ marginTop: 8, display: 'flex', justifyContent: 'end', position: 'relative' }}>
				<div style={{ position: 'absolute', left: '0' }}>
					<UploadAntdFiles />
				</div>
				<div style={{ textAlign: 'right' }}>
					<Button onClick={cancel} style={{ marginRight: 8 }}>
						Отменить
					</Button>
					<Button type="primary" onClick={handleSubmit} loading={loading}>
						Добавить
					</Button>
				</div>
			</div>
		</>
	);
};

export default SendPublication;
