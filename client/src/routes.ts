import Admin from './pages/Admin';
import {
	ADMIN_ROUTE,
	BLOCKED_ROUTE,
	DONATIONS_ROUTE,
	ERROR_ROUTE,
	EXIT_ROUTE,
	FOUNDERS_ROUTE,
	HOME_ROUTE,
	MAIL_ROUTE,
	MESSAGES_ROUTE,
	PERSONALE_ROUTE,
	PUBLICATION_ID_ROUTE,
	PUBLICATION_ROUTE,
	REGISTRATION_ROUTE,
	RESTORE_PROFILE_ROUTE,
	RULES_ROUTE,
	VK_CALLBACK_ROUTE,
	GROUP_ROUTE,
	ONE_GROUP_ROUTE,
} from './utils/consts';
import Home from './pages/Home/Home.tsx';
import VkCallback from './pages/VkCallback';
import Error_Page from './pages/Error_Page';
import Registration from './pages/Registration';
import Exit from './pages/Exit';
import Founders from './pages/Founders';
import RestoreUser from './pages/RestoreUser';
import Rules from './pages/Rules';
import Mail from './pages/Mail';
import Messages from './pages/Messages/MessagesPage.tsx';
import Blocked from './pages/Blocked.tsx';
import Donations from './pages/Donations.tsx';
import Group from './pages/GroupPage/GroupPage.tsx';
import Publications from './pages/Publications/Publications.tsx';
import OnePublication from './pages/OnePublication/OnePublication.tsx';
import PersonalePage from './pages/PersonalePage/PersonalePage.tsx';
import OneGroup from './pages/OneGroup/OneGroup.tsx';

export const adminRoutes = [
	{
		path: ADMIN_ROUTE,
		Component: Admin,
	},
];

export const authRoutes = [
	{
		path: EXIT_ROUTE,
		Component: Exit,
	},
	{
		path: `${ONE_GROUP_ROUTE}/:id`,
		Component: OneGroup,
	},
	{
		path: MAIL_ROUTE,
		Component: Mail,
	},
];

export const registrationRoutes = [
	{
		path: REGISTRATION_ROUTE,
		Component: Registration,
	},
];

export const restoreRoutes = [
	{
		path: RESTORE_PROFILE_ROUTE,
		Component: RestoreUser,
	},
];

export const publicRoutes = [
	{
		path: HOME_ROUTE,
		Component: Home,
	},
	{
		path: VK_CALLBACK_ROUTE,
		Component: VkCallback,
	},
	{
		path: FOUNDERS_ROUTE,
		Component: Founders,
	},
	{
		path: `${PERSONALE_ROUTE}/:id`,
		Component: PersonalePage,
	},
	{
		path: RULES_ROUTE,
		Component: Rules,
	},
	{
		path: BLOCKED_ROUTE,
		Component: Blocked,
	},
	{
		path: DONATIONS_ROUTE,
		Component: Donations,
	},
	{
		path: PUBLICATION_ROUTE,
		Component: Publications,
	},
	{
		path: `${PUBLICATION_ID_ROUTE}/:id`,
		Component: OnePublication,
	},
	{
		path: `${MESSAGES_ROUTE}/:location`,
		Component: Messages,
	},
	{
		path: `${GROUP_ROUTE}/:location`,
		Component: Group,
	},
];

export const errorRoutes = [
	{
		path: ERROR_ROUTE,
		Component: Error_Page,
	},
];
