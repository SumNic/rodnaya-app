import React from 'react';

import { Button } from 'antd';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';

import { observer } from 'mobx-react-lite';

import styles from './Post.module.css';

interface PostProps {
	editedText: string;
	setEditedText: React.Dispatch<React.SetStateAction<string>>;
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
	handleEditPost: (text: string) => Promise<void>;
}

const EditingPost: React.FC<PostProps> = ({ editedText, setEditedText, setIsEditing, handleEditPost }) => {
	const sendEditedMessage = async () => {
		if (!editedText.trim()) return;
		await handleEditPost(editedText.trim());
		setIsEditing(false);
	};

	return (
		<div className={styles.editContainer}>
			<TextArea
				value={editedText}
				onChange={(e) => setEditedText(e.target.value)}
				autoSize={{ minRows: 2, maxRows: 4 }}
			/>
			<div className={styles.buttonsWrapper}>
				<Button
					type="text"
					icon={<CloseOutlined style={{ color: '#ff4d4f', fontSize: '28px' }} />}
					onClick={() => setIsEditing(false)}
					style={{ padding: 0, height: 'auto', marginLeft: 8 }}
				/>
				<Button
					type="text"
					icon={<SendOutlined style={{ color: '#b1b3b1', fontSize: '36px' }} />}
					onClick={sendEditedMessage}
					style={{ padding: 0, height: 'auto' }}
				/>
			</div>
		</div>
	);
};

export default observer(EditingPost);
