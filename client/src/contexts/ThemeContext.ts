import { createContext, useContext } from 'react';

import { ThemeConfig } from 'antd';
import { CurrentColorScheme, DeviceType } from '../hooks/useTheme.hook';

// import { CurrentColorScheme } from '@/src/hooks/useTheme.hook';

// import { DeviceType } from '@/src/hooks/useTheme.hook';

interface themeContextType {
	currentTheme: ThemeConfig;
	isLightTheme: boolean;
	switchTheme: (isLight: boolean) => void;
	deviceType: DeviceType;
	getDeviceType: (width: number, height: number) => DeviceType;
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
