import Admin from "./pages/Admin"
import Personale_page from "./pages/Personale_page"
import { ADMIN_ROUTE, ERROR_ROUTE, EXIT_ROUTE, FOUNDERS_ROUTE, HOME_ROUTE, LOGIN_ROUTE, MESSAGES_ROUTE, PERSONALE_CARD_ROUTE, PERSONALE_ROUTE, REGISTRATION_ROUTE, VK_CALLBACK_ROUTE } from "./utils/consts"
import Home from "./pages/Home"
import Messages from "./pages/Messages"
import VkCallback from "./pages/VkCallback"
import Error_Page from "./pages/Error_Page"
import Registration from "./pages/Registration"
import Auth from "./pages/Auth"
import Exit from "./pages/Exit"
import Founders from "./pages/Founders"
import Personale_kard from "./pages/Personale_kard"

export const adminRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
]

export const authRoutes = [
    {
        path: PERSONALE_ROUTE,
        Component: Personale_page
    },
    {
        path: `${MESSAGES_ROUTE}/:location`,
        Component: Messages
    },
    {
        path: EXIT_ROUTE,
        Component: Exit
    },
]

export const registrationRoutes = [
    {
        path: REGISTRATION_ROUTE,
        Component: Registration
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
]

export const publicRoutes = [
    {
        path: HOME_ROUTE,
        Component: Home
    },
    {
        path: VK_CALLBACK_ROUTE,
        Component: VkCallback
    },
    {
        path: FOUNDERS_ROUTE,
        Component: Founders
    },
    {
        path: PERSONALE_CARD_ROUTE,
        Component: Personale_kard
    },
]

export const errorRoutes = [
    {
        path: ERROR_ROUTE,
        Component: Error_Page
    },
]