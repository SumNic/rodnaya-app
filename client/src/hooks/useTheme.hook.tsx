import { useEffect, useState } from 'react';

import { theme } from 'antd';
import colorScheme from '../app/styles/ColorScheme';
import { SMARTPHONE_WIDTH } from '../utils/consts';

// import { SMARTPHONE_WIDTH } from '@/src/utils/constants.ts';

// import colorScheme from '@/src/app/styles/ColorScheme.ts';

export type DeviceType = 'smartphoneVertical' | 'smartphoneHorizontal' | 'tablet';

const initialTheme = localStorage.getItem('BOAT_CLOUD_THEME');

export interface CurrentColorScheme {
	brandColor: string;
	textColorBase: string;
	successPrimary: string;
	/* Цвет зелёных индикаторов аккордеона */
	successSecondary: string;
	/* Цвет красных кнопок аккордеона а также цвет других элементов, сигнализирующих об опасности или ошибке */
	errorPrimary: string;
	/* Цвет индикаторов аккордеона, содержащих ошибку */
	errorSecondary: string;
	/* Цвет оранжевых кнопок и выделенных кнопок тапбара */
	warningPrimary: string;
	/* Цвет оранжевых панелей телеметрии */
	warningSecondary: string;
	infoPrimary: string;
	infoSecondary: string;
	/* Цвет панелей аккордеона (более тёмный в светлой теме) */
	bgSecondary: string;
	/* Цвет заливки неактивных кнопок тапбара */
	tapbarBtnDisabled: string;
	/* Цвет иконок тапбара */
	tapbarIcon: string;
	/* Цвет бордера панелей аккордеона */
	borderColor: string;
	/* Цвет селектора на панели аккоредона */
	selectBackgroundColor: string;
	/* Цвет строк таблицы файлов */
	selectBackgroundColorTableRow: string;
	/* Цвет точек drag end drop */
	dragEndDropCollapsePrimary: string;
	dragEndDropCollapse: string;
	/* Цвет фона верхнего меню и подвала */
	topMenuBg: string;
	/* Цвет границы аватара */
	colorPrimaryBorder: string;
	collapseSecondLevelBg: string;
	vkIconBg: string;
	/* Цвет заливки неактивных кнопок тапбара */
}

const lightScheme: CurrentColorScheme = {
	brandColor: colorScheme.LightThemeBrandColor,
	textColorBase: colorScheme.textColorBase,
	successPrimary: colorScheme.lightThemeSuccessPrimary,
	successSecondary: colorScheme.lightThemeSuccessSecondary,
	errorPrimary: colorScheme.lightThemeErrorPrimary,
	errorSecondary: colorScheme.lightThemeErrorSecondary,
	warningPrimary: colorScheme.lightThemeWarningPrimary,
	warningSecondary: colorScheme.lightThemeWarningSecondary,
	infoPrimary: colorScheme.lightThemeInfoPrimary,
	infoSecondary: colorScheme.lightThemeInfoSecondary,
	bgSecondary: colorScheme.lightThemeBgSecondary,
	tapbarBtnDisabled: colorScheme.lightThemeTapbarBtnDisabled,
	tapbarIcon: colorScheme.lightThemeTapbarIcon,
	borderColor: colorScheme.lightThemeBorderColor,
	selectBackgroundColor: colorScheme.lightThemeSelectBackgroundColor,
	selectBackgroundColorTableRow: colorScheme.lightThemeTableRowSelectedHoverBg,
	dragEndDropCollapsePrimary: colorScheme.lightThemeDragEndDropCollapsePrimary,
	dragEndDropCollapse: colorScheme.lightThemeDragEndDropCollapse,
	topMenuBg: colorScheme.lightThemeTopMenuBg,
	colorPrimaryBorder: colorScheme.lightThemeColorPrimaryBorder,
	collapseSecondLevelBg: colorScheme.lightThemeCollapseSecondLevelBg,
	vkIconBg: colorScheme.lightThemeVkIconBg,
};

const darkScheme: CurrentColorScheme = {
	brandColor: colorScheme.darkThemeBrandColor,
	textColorBase: colorScheme.textColorBase,
	successPrimary: colorScheme.darkThemeSuccessPrimary,
	successSecondary: colorScheme.darkThemeSuccessSecondary,
	errorPrimary: colorScheme.darkThemeErrorPrimary,
	errorSecondary: colorScheme.darkThemeErrorSecondary,
	warningPrimary: colorScheme.darkThemeWarningPrimary,
	warningSecondary: colorScheme.darkThemeWarningSecondary,
	infoPrimary: colorScheme.darkThemeInfoPrimary,
	infoSecondary: colorScheme.darkThemeInfoSecondary,
	bgSecondary: colorScheme.darkThemeBgSecondary,
	tapbarBtnDisabled: colorScheme.darkThemeTapbarBtnDisabled,
	tapbarIcon: colorScheme.darkThemeTapbarIcon,
	borderColor: colorScheme.darkThemeBorderColor,
	selectBackgroundColor: colorScheme.darkThemeSelectBackgroundColor,
	selectBackgroundColorTableRow: colorScheme.darkThemeTableRowSelectedHoverBg,
	dragEndDropCollapsePrimary: colorScheme.darkThemeDragEndDropCollapsePrimary,
	dragEndDropCollapse: colorScheme.darkThemeDragEndDropCollapse,
	topMenuBg: colorScheme.darkThemeTopMenuBg,
	colorPrimaryBorder: colorScheme.darkThemeColorPrimaryBorder,
	collapseSecondLevelBg: colorScheme.darkThemeCollapseSecondLevelBg,
	vkIconBg: colorScheme.darkThemeVkIconBg,
};

export const useTheme = () => {
	const [deviceType, setDeviceType] = useState<DeviceType>('smartphoneVertical');
	const [isInitialRender, setIsInitialRender] = useState(true);
	const [currentWidth, setCurrentWidth] = useState<number>();
	const [isLightTheme, setIsLightTheme] = useState(initialTheme !== 'dark');
	const [currentColorScheme, setCurrentColorScheme] = useState<CurrentColorScheme>(
		initialTheme !== 'dark' ? lightScheme : darkScheme
	);

	const getDeviceType = (width: number, height: number): DeviceType => {
		if (width <= SMARTPHONE_WIDTH) return 'smartphoneVertical';
		if (height <= SMARTPHONE_WIDTH) return 'smartphoneHorizontal';
		return 'tablet';
	};

	useEffect(() => {
		const handleResize = () => {
			setDeviceType(getDeviceType(window.innerWidth, window.innerHeight));
			setCurrentWidth(window.innerWidth);
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		const newAlgorithm = [isLightTheme ? theme.defaultAlgorithm : theme.darkAlgorithm];
		if (deviceType === 'smartphoneVertical' || deviceType === 'smartphoneHorizontal')
			newAlgorithm.push(theme.compactAlgorithm);
	}, [deviceType]);

	const switchTheme = (isLight: boolean) => {
		localStorage.setItem('BOAT_CLOUD_THEME', isLight ? 'light' : 'dark');
		setIsLightTheme(isLight);

		const newAlgorithm = [isLight ? theme.defaultAlgorithm : theme.darkAlgorithm];
		if (deviceType === 'smartphoneVertical' || deviceType === 'smartphoneHorizontal')
			newAlgorithm.push(theme.compactAlgorithm);
	};

	useEffect(() => {
		// const oldClass = isLightTheme ? 'dark-scrollbar' : 'light-scrollbar';
		// const newClass = isLightTheme ? 'light-scrollbar' : 'dark-scrollbar';

		if (!isInitialRender) setCurrentColorScheme(isLightTheme ? lightScheme : darkScheme);
		setIsInitialRender(false);

		const body = document.getElementById('body');

		if (body) {
			if (isLightTheme) {
				body.classList.remove('dark-scrollbar');
			} else {
				body.classList.add('dark-scrollbar');
			}
		}
	}, [isLightTheme]);

	useEffect(() => {
		switchTheme(isLightTheme);
	}, []);

	return {
		currentColorScheme,
		currentWidth,
	};
};
