import React, { useState } from 'react';
import { Button, Input, Typography } from 'antd';
import { ALLOWED_VIDEO_HOSTS } from '../utils/consts';
import { Link } from 'react-router-dom';

const { Text } = Typography;

interface AddVideoLinkProps {
	videoUrls: string[];
	setVideoUrls: React.Dispatch<React.SetStateAction<string[]>>;
	videoError: string | null;
	setVideoError: React.Dispatch<React.SetStateAction<string | null>>;
	loading?: boolean;
}

const isAllowedVideoUrl = (url: string): boolean => {
	try {
		const parsed = new URL(url);
		// Список разрешённых видео-хостов
		return ALLOWED_VIDEO_HOSTS.some((host) => parsed.hostname.includes(host));
	} catch {
		return false;
	}
};

const AddVideoLink: React.FC<AddVideoLinkProps> = ({ videoUrls, setVideoUrls, videoError, setVideoError, loading }) => {
	const [videoUrl, setVideoUrl] = useState<string>('');

	const handleAddVideo = () => {
		const trimmedUrl = videoUrl.trim();

		if (!isAllowedVideoUrl(trimmedUrl)) {
			setVideoError('Разрешены только видео из YouTube, VK, Rutube, Vimeo, TikTok и др.');
			return;
		}

		if (videoUrls.includes(trimmedUrl)) {
			setVideoError('Такая ссылка уже добавлена');
			return;
		}

		setVideoUrls((prev) => [...prev, trimmedUrl]);
		setVideoUrl('');
		setVideoError(null);
	};

	return (
		<>
			<div style={{ display: 'flex', gap: 8 }}>
				<Input
					value={videoUrl}
					onChange={(e) => {
						setVideoUrl(e.target.value);
						setVideoError(null);
					}}
					placeholder="Вставьте ссылку на видео (YouTube, VK, Rutube и др.)"
					disabled={loading}
				/>
				<Button
					onClick={handleAddVideo} // Добавляем видео
					disabled={loading || !videoUrl.trim()}
				>
					Добавить
				</Button>
			</div>
			{videoError && <div style={{ color: 'red', fontSize: 12 }}>{videoError}</div>}
			{videoUrls.length > 0 && (
				<div style={{ marginTop: 8 }}>
					<Text>Добавленные видео:</Text>
					<ul>
						{videoUrls.map((url, index) => (
							<li key={index}>
								<Text>
									<Link to={url} target="_blank" rel="noopener noreferrer">
										{url}
									</Link>
								</Text>
							</li>
						))}
					</ul>
				</div>
			)}
		</>
	);
};

export default AddVideoLink;
