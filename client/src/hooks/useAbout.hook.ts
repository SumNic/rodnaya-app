import { useMemo, useState } from 'react';

export const useAbout = () => {
	const [isModalNewWorkgroupOpen, setIsModalNewWorkgroupOpen] = useState<boolean>(false);
    const [posts, setPosts] = useState<any>([])

    useMemo(() => posts, [])

	return {
		isModalNewWorkgroupOpen,
		setIsModalNewWorkgroupOpen,
        posts,
        setPosts,
	};
};
