import { useState } from 'react';

export const useAbout = () => {
	const [isModalNewWorkgroupOpen, setIsModalNewWorkgroupOpen] = useState<boolean>(false);

	return {
		isModalNewWorkgroupOpen,
		setIsModalNewWorkgroupOpen,
	};
};
