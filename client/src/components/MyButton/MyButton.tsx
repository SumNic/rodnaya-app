import React from 'react';
import styles from './MyButton.module.css';

interface MyButtonProps {
	text: string;
	onClick?: () => void;
}

const MyButton: React.FC<MyButtonProps> = ({ text, onClick }) => {
	return (
		<button className={styles.VkIdWebSdk__button} onClick={onClick}>
			<div className={styles.VkIdWebSdk__button_container}>
				<div className={styles.VkIdWebSdk__button_icon}></div>
				<div className={styles.VkIdWebSdk__button_text}>{text}</div>
			</div>
		</button>
	);
};

export default MyButton;
