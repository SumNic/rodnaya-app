import React, { useMemo } from 'react';

import styles from './Post.module.css';

interface PostVideoAttachmentProps {
	videoUrl: string;
	width: number;
	onOpen: (url: string) => void;
}

interface PostVideoModalContentProps {
	videoUrl: string;
}

export const getVideoEmbedInfo = (videoUrl: string): { isEmbed: boolean; embedUrl?: string; platform?: string } => {
	// Валидация URL: если невалидный или неподдерживаемый протокол — не встраиваем
	try {
		const parsed = new URL(videoUrl);
		if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
			return { isEmbed: false };
		}
	} catch {
		return { isEmbed: false };
	}

	// YouTube
	if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
		let videoId = '';
		if (videoUrl.includes('youtube.com/watch')) {
			videoId = videoUrl.split('v=')[1]?.split('&')[0] || '';
		} else if (videoUrl.includes('youtu.be/')) {
			videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0] || '';
		}
		if (videoId) {
			return {
				isEmbed: true,
				embedUrl: `https://www.youtube.com/embed/${videoId}`,
				platform: 'YouTube',
			};
		}
	}

	// Vimeo
	if (videoUrl.includes('vimeo.com/')) {
		const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0] || '';
		if (videoId) {
			return {
				isEmbed: true,
				embedUrl: `https://player.vimeo.com/video/${videoId}`,
				platform: 'Vimeo',
			};
		}
	}

	// TikTok
	// Примеры:
	// https://www.tiktok.com/@user/video/7222222222222222
	// https://www.tiktok.com/@user/video/7222222222222222?is_from_webapp=1
	if (videoUrl.includes('tiktok.com/@') && videoUrl.includes('/video/')) {
		const match = videoUrl.match(/\/video\/(\d+)/);
		const videoId = match?.[1] || '';
		if (videoId) {
			return {
				isEmbed: true,
				embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
				platform: 'TikTok',
			};
		}
	}

	// ВКонтакте
	if (videoUrl.includes('vk.com/video') || videoUrl.includes('vk.com/videos')) {
		// Формат: https://vk.com/video-123456_789012 или https://vk.com/video123456_789012
		// Или: https://vk.com/videos-123456?z=video-123456_789012
		let videoId = '';
		let ownerId = '';

		// Извлекаем из формата video-owner_id_video_id или video123456_789012
		const videoMatch = videoUrl.match(/video[_-]?(-?\d+)[_-](\d+)/);
		if (videoMatch) {
			ownerId = videoMatch[1];
			videoId = videoMatch[2];
		} else {
			// Альтернативный формат: video123456_789012
			const altMatch = videoUrl.match(/video(-?\d+)_([\d]+)/);
			if (altMatch) {
				ownerId = altMatch[1];
				videoId = altMatch[2];
			}
		}

		// Формат из параметра z=video-123456_789012
		if (!videoId) {
			const paramMatch = videoUrl.match(/z=video([-]?\d+)_([\d]+)/);
			if (paramMatch) {
				ownerId = paramMatch[1];
				videoId = paramMatch[2];
			}
		}

		if (videoId && ownerId) {
			const embedOwnerId = ownerId.startsWith('-') ? ownerId : `-${ownerId}`;
			return {
				isEmbed: true,
				embedUrl: `https://vk.com/video_ext.php?oid=${embedOwnerId}&id=${videoId}`,
				platform: 'VK',
			};
		}
	}

	// Rutube
	if (videoUrl.includes('rutube.ru/video/') || videoUrl.includes('rutube.ru/play/')) {
		const videoIdMatch = videoUrl.match(/rutube\.ru\/(?:video|play)\/([a-zA-Z0-9]+)/);
		if (videoIdMatch) {
			return {
				isEmbed: true,
				embedUrl: `https://rutube.ru/play/embed/${videoIdMatch[1]}`,
				platform: 'Rutube',
			};
		}
	}

	// Dailymotion
	if (videoUrl.includes('dailymotion.com/video/')) {
		const videoId = videoUrl.split('dailymotion.com/video/')[1]?.split('?')[0] || '';
		if (videoId) {
			return {
				isEmbed: true,
				embedUrl: `https://www.dailymotion.com/embed/video/${videoId}`,
				platform: 'Dailymotion',
			};
		}
	}

	// Google Drive
	// Пример: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
	// Embed:  https://drive.google.com/file/d/FILE_ID/preview
	if (videoUrl.includes('drive.google.com/file/d/')) {
		const match = videoUrl.match(/drive\.google\.com\/file\/d\/([^/]+)/);
		const fileId = match?.[1];
		if (fileId) {
			return {
				isEmbed: true,
				embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
				platform: 'GoogleDrive',
			};
		}
	}

	// PeerTube (generic)
	// Пример: https://peertube.example/videos/watch/UUID -> /videos/embed/UUID
	if (videoUrl.includes('/videos/watch/')) {
		try {
			const u = new URL(videoUrl);
			const embedUrl = `${u.origin}/videos/embed/${u.pathname.split('/videos/watch/')[1]?.split('/')[0] || ''}`;
			if (embedUrl.endsWith('/')) {
				return { isEmbed: false };
			}
			return { isEmbed: true, embedUrl, platform: 'PeerTube' };
		} catch {
			// ignore
		}
	}

	// Telegram посты (iframe виджет)
	// Пример: https://t.me/channel/12345 -> https://t.me/channel/12345?embed=1
	// Работоспособность зависит от CSP и того, разрешает ли Telegram embed конкретного поста
	if (videoUrl.includes('t.me/')) {
		return {
			isEmbed: true,
			embedUrl: videoUrl.includes('?') ? `${videoUrl}&embed=1` : `${videoUrl}?embed=1`,
			platform: 'Telegram',
		};
	}

	// Ok.ru (Одноклассники)
	if (videoUrl.includes('ok.ru/video/') || videoUrl.includes('odnoklassniki.ru/video/')) {
		const videoIdMatch = videoUrl.match(/(?:ok\.ru|odnoklassniki\.ru)\/video\/(\d+)/);
		if (videoIdMatch) {
			return {
				isEmbed: true,
				embedUrl: `https://ok.ru/videoembed/${videoIdMatch[1]}`,
				platform: 'OK',
			};
		}
	}

	// Прямые ссылки на видеофайлы
	const isDirectVideo = /\.(mp4|webm|ogg|mov|avi|mkv|flv|wmv|m4v)(\?|$)/i.test(videoUrl);
	if (isDirectVideo) {
		return { isEmbed: false };
	}

	// Неизвестные платформы: безопасно НЕ встраиваем
	return { isEmbed: false };
};

export const PostVideoAttachment: React.FC<PostVideoAttachmentProps> = ({ videoUrl, width, onOpen }) => {
	const videoInfo = useMemo(() => getVideoEmbedInfo(videoUrl), [videoUrl]);

	if (videoInfo.isEmbed && videoInfo.embedUrl) {
		return (
			<div className={styles.attachmentImage}>
				<iframe
					src={videoInfo.embedUrl}
					style={{
						width: '100%',
						height: (width * 9) / 16,
						borderRadius: '12px',
						border: 'none',
					}}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
					onClick={(e) => {
						e.stopPropagation();
						onOpen(videoUrl);
					}}
				/>
			</div>
		);
	}

	return (
		<div className={styles.attachmentImage}>
			<video
				src={videoUrl}
				controls
				preload="metadata"
				style={{
					width: '100%',
					height: (width * 9) / 16,
					objectFit: 'contain',
					borderRadius: '12px',
					background: '#000',
				}}
				onClick={(e) => {
					e.stopPropagation();
					onOpen(videoUrl);
				}}
			/>
		</div>
	);
};

export const PostVideoModalContent: React.FC<PostVideoModalContentProps> = ({ videoUrl }) => {
	const videoInfo = useMemo(() => getVideoEmbedInfo(videoUrl), [videoUrl]);

	if (videoInfo.isEmbed && videoInfo.embedUrl) {
		let embedUrl = videoInfo.embedUrl;

		if (videoInfo.platform === 'YouTube' || videoInfo.platform === 'Vimeo') {
			embedUrl += embedUrl.includes('?') ? '&autoplay=1' : '?autoplay=1';
		}

		return (
			<iframe
				src={embedUrl}
				style={{
					width: '100%',
					height: '80vh',
					borderRadius: '12px',
					border: 'none',
				}}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		);
	}

	return (
		<video
			src={videoUrl}
			controls
			autoPlay
			preload="auto"
			style={{
				width: '100%',
				maxHeight: '80vh',
				objectFit: 'contain',
				borderRadius: '12px',
			}}
		/>
	);
};
