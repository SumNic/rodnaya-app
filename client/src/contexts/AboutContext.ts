import { createContext, useContext } from 'react';

interface AboutContextType {
	isModalNewWorkgroupOpen: boolean | undefined;
	setIsModalNewWorkgroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AboutContext = createContext<AboutContextType | null>(null);

export const useAboutContext = () => {
	const aboutContext = useContext(AboutContext);

	if (!aboutContext) {
		throw new Error('useAboutContext должен быть использован внутри <AboutContext.Provider>');
	}

	return aboutContext;
};
