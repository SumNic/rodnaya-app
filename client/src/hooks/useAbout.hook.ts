import { useMemo, useState } from 'react';
import { IPost } from '../models/IPost.ts';

export const useAbout = () => {
	const [isModalNewWorkgroupOpen, setIsModalNewWorkgroupOpen] = useState<boolean>(false);
    const [posts, setPosts] = useState<IPost[]>()

    useMemo(() => posts, [])

	return {
		isModalNewWorkgroupOpen,
		setIsModalNewWorkgroupOpen,
        posts,
        setPosts,
	};
};
