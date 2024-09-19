import { createContext, useContext } from 'react';
import { IPost } from '../models/IPost.ts';

interface AboutContextType {
	isModalNewWorkgroupOpen: boolean | undefined;
	setIsModalNewWorkgroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
    posts: IPost[] | undefined;
	setPosts: React.Dispatch<React.SetStateAction<IPost[] | undefined>>;
}

export const AboutContext = createContext<AboutContextType | null>(null);

export const useAboutContext = () => {
	const aboutContext = useContext(AboutContext);

	if (!aboutContext) {
		throw new Error('useAboutContext должен быть использован внутри <AboutContext.Provider>');
	}

	return aboutContext;
};
