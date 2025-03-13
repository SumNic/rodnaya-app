import React from 'react';

interface Props {
	platform: string;
	url: string;
	text: string;
}

const ShareButton: React.FC<Props> = ({ platform, url, text }) => {
	const shareUrl = encodeURIComponent(url);
	const handleShare = () => {
		

		let shareLink = '';
		if (platform === 'vk') {
			shareLink = `https://vk.com/share.php?url=${shareUrl}&title=${text}`;
		} else if (platform === 'telegram') {
			shareLink = `https://t.me/share/url?url=${shareUrl}&text=${text}`;
		} else if (platform === 'whatsapp') {
			shareLink = `https://api.whatsapp.com/send?text=${text}%20${shareUrl}`;
		}

		if (shareLink) {
			window.open(
				shareLink,
				'popupWindow',
				'width=600,height=500,left=100,top=100,resizable=no,scrollbars=no,status=no'
			);
		}
	};

	let share = '';
	switch (platform) {
		case 'vk':
			share = 'Вконтакте'
			break;
		case 'telegram':
			share = 'Телеграм'
			break;
		case 'whatsapp':
			share = 'WhatsApp'
			break;
	}

	return (
		<div>
			<div onClick={handleShare}>{share}</div>
		</div>
	);
};

export default ShareButton;
