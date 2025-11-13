import { createContext, useContext } from 'react';

import { CurrentColorScheme } from '../hooks/useTheme.hook';

// import { CurrentColorScheme } from '@/src/hooks/useTheme.hook';

// import { DeviceType } from '@/src/hooks/useTheme.hook';

interface themeContextType {
	currentColorScheme: CurrentColorScheme;
	currentWidth: number | undefined;
}

export const ThemeContext = createContext<themeContextType | null>(null);

export const useThemeContext = () => {
	const themeContext = useContext(ThemeContext);

	if (!themeContext) {
		throw new Error('useThemeContext должен быть использован внутри <ThemeContext.Provider>');
	}

	return themeContext;
};
