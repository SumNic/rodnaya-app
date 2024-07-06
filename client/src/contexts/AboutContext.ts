import { createContext, useContext } from 'react';

interface AboutContextType {
	isModalNewWorkgroupOpen: boolean | undefined;
	setIsModalNewWorkgroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
    posts: any | undefined;
	setPosts: React.Dispatch<React.SetStateAction<any>>;
}

export const AboutContext = createContext<AboutContextType | null>(null);

export const useAboutContext = () => {
	const aboutContext = useContext(AboutContext);

	if (!aboutContext) {
		throw new Error('useAboutContext должен быть использован внутри <AboutContext.Provider>');
	}

	return aboutContext;
};
