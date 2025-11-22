import { useState } from 'react';

import styles from './ExpandableText.module.css';
import { Modal } from 'antd';

const ExpandableText = ({ text }: { text: string }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [currentUrl, setCurrentUrl] = useState<string>('');

	const maxLength = 300;

	const toggleExpand = () => setIsExpanded(!isExpanded);

	// Преобразуем JSX в строку
	const plainText = text; // Убираем HTML-теги
	const shouldTruncate = plainText.length > maxLength;

	// Обрезаем строку и снова применяем renderTextWithLinks
	const truncatedText = shouldTruncate ? plainText.slice(0, maxLength) + '...' : plainText;
	const displayedText = isExpanded ? text : truncatedText;

	// Функция для открытия модального окна
	const showModal = (url: string): void => {
		let httpUrl = '';
		if (!/^https?:\/\//i.test(url)) {
			httpUrl = `https://${url}`;
		} else {
			httpUrl = url;
		}
		setCurrentUrl(httpUrl); // Сохраняем текущую ссылку
		setIsModalVisible(true);
	};

	// Функция для преобразования URL в отображаемый текст
	const formatUrl = (url: string): string => {
		try {
			if (url.length < 20) return url; // показываем полностью

			const { hostname } = new URL(/^https?:\/\//i.test(url) ? url : 'https://' + url);

			return `${hostname}...`;
		} catch (error) {
			return url;
		}
	};

	const renderTextWithLinks = (text: string): JSX.Element[] => {
		const urlRegex =
			/(\b(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)|(\bwww\.[^\s/$.?#].[^\s]*)|(\b[-A-Z0-9+&@#\/%?=~_|!:,.;]*\.(?:com|net|org|ru|info|biz|me|co|us|uk|gov)\b)/gi;

		const parts = text.split(urlRegex);

		return parts
			.filter((part) => part !== '' && part !== undefined && part !== 'https' && part !== 'http')
			.map((part, index) => {
				if (urlRegex.test(part)) {
					return (
						<a
							key={index}
							href="#"
							className={styles.link}
							onClick={(e) => {
								e.preventDefault(); // Предотвращаем переход по ссылке сразу
								showModal(part); // Показываем модальное окно
							}}
						>
							{formatUrl(part)} {/* Форматируем и отображаем ссылку */}
						</a>
					);
				}
				return <span key={index}>{part}</span>; // Возвращаем обычный текст
			});
	};

	// Функция для обработки перехода по ссылке
	const handleOk = (): void => {
		window.open(currentUrl, '_blank'); // Открываем ссылку в новой вкладке
		setIsModalVisible(false); // Закрываем модальное окно
	};

	const handleCancel = (): void => {
		setIsModalVisible(false); // Просто закрываем модальное окно
	};

	return (
		<>
			<div className={styles['text-container']}>{renderTextWithLinks(displayedText)}</div>
			{shouldTruncate && (
				<span className={styles['show-more']} onClick={toggleExpand}>
					{isExpanded ? 'Скрыть' : 'Показать ещё'}
				</span>
			)}
			<Modal
				title="Подтверждение"
				open={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				okText="Да"
				cancelText="Нет"
			>
				<p>Вы желаете перейти по внешней ссылке?</p>
			</Modal>
		</>
	);
};

export default ExpandableText;
