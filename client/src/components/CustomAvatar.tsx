import { Avatar } from 'antd';
import React from 'react';

interface AvatarProps {
	photoUrl: string | undefined;
	size: number;
	names: string[];
}

const CustomAvatar: React.FC<AvatarProps> = ({ photoUrl, size, names }) => {
	const getInitials = (names: string[]) => {
		return names.reduce((initial, name) => {
			return `${initial}${name.trim()[0]?.toUpperCase()}`;
		}, '');
	};

	const colors = ['#fe9000', '#ff6a00', '#ffb800', '#0084ff', '#00bcd4', '#34c759', '#722ed1', '#f5222d'];

	const getColorFromInitials = (name: string) => {
		if (!name) return colors[0];
		const charCode = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
		return colors[charCode % colors.length];
	};

	const initial = getInitials(names);
	const backgroundColor = getColorFromInitials(initial);

	return (
		<>
			{photoUrl ? (
				<Avatar className="mes_foto" src={photoUrl} size={size} />
			) : (
				<Avatar size={size} className="mes_foto" style={{ fontSize: size / 2.5, fontWeight: 'bold', backgroundColor }}>
					{initial}
				</Avatar>
			)}
		</>
	);
};

export default CustomAvatar;
