import React, { useEffect, useRef, useState } from 'react';
import { message, Modal } from 'antd';
import { useStoreContext } from '../../contexts/StoreContext';
import UploadAntdFiles from '../UploadAntdFiles/UploadAntdFiles';
import TextArea from 'antd/es/input/TextArea';
import AddVideoLink from '../AddVideoLink';
import { Files } from '../../hooks/useUploadForm';
import { CreatePublicationDto } from '../../services/PublicationsService';

const MAX_LENGTH = 500;

interface SendPublicationProps {
	handleCancel: () => void;
}

const SendPublication: React.FC<SendPublicationProps> = ({ handleCancel }) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [videoUrls, setVideoUrls] = useState<string[]>([]);
	const [videoError, setVideoError] = useState<string | null>(null);
	const { store } = useStoreContext();
	const publicationTextRef = useRef<string>('');
	const [error, setError] = useState(false);

	useEffect(() => {
		publicationTextRef.current = '';
		setVideoUrls([]);
		store.filesStore.resetFiles();
	}, [store.filesStore]);

	const cancel = () => {
		publicationTextRef.current = '';
		setVideoUrls([]);
		store.filesStore.resetFiles();
		handleCancel();
	};

	const handleSubmit = async () => {
		if (!publicationTextRef.current.trim()) {
			setError(true);
			return;
		}

		setLoading(true);

		try {
			// файлы
			const arrIdFiles = store.filesStore.files.map(
				(file) =>
					({
						id: file.id,
						fileName: file.fileName,
						fileNameUuid: file.fileNameUuid,
					}) as Files
			);

			const dto: CreatePublicationDto = {
				id_user: store.authStore.user.id,
				secret: store.authStore.user.secret,
				form: {
					message: publicationTextRef.current,
					files: arrIdFiles,
					video: videoUrls.length ? videoUrls : undefined, // видео может быть необязательным
				},
			};

			const response = await store.publicationStore.addPublication(dto);

			if (response.error) {
				message.error(response.error);
				return;
			}
			cancel();
		} catch (error) {
			console.error('Ошибка в handleSubmit:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (publicationTextRef.current.trim().length > 0 && !e.shiftKey && e.key === 'Enter') {
			e.preventDefault();
			handleSubmit();
		}
	};

	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		publicationTextRef.current = e.target.value;
		if (e.target.value.trim()) setError(false);
	};

	return (
		<Modal
			open={true}
			okText={loading ? 'Отправка...' : 'Отправить'}
			cancelText="Отмена"
			onOk={handleSubmit}
			onCancel={cancel}
			width={600}
		>
			<h2 style={{ textAlign: 'center' }}>Новая публикация</h2>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
				{/* Текстовое поле */}
				<div style={{ marginBottom: 15, position: 'relative' }}>
					<TextArea
						rows={4}
						defaultValue={publicationTextRef.current}
						onChange={handleTextChange}
						placeholder="Введите сообщение"
						disabled={loading}
						onKeyDown={handleKeyDown}
						maxLength={MAX_LENGTH}
						showCount
					/>
					{error && (
						<div style={{ color: 'red', fontSize: 12, position: 'absolute', bottom: -20, left: 10 }}>
							Поле обязательно
						</div>
					)}
				</div>

				{/* Вставка ссылки на видео */}
				<AddVideoLink
					videoUrls={videoUrls}
					setVideoUrls={setVideoUrls}
					videoError={videoError}
					setVideoError={setVideoError}
					loading={loading}
				/>

				{/* Блок с файлами */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-end',
						flexWrap: 'wrap',
						gap: 8,
					}}
				>
					<div style={{ flex: '1 1 auto', minWidth: 0 }}>
						<UploadAntdFiles />
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default SendPublication;
