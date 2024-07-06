import Admin from "./pages/Admin"
import Personale_page from "./pages/Personale_page"
import { ADMIN_ROUTE, ERROR_ROUTE, EXIT_ROUTE, FILES_ROUTE, FOUNDERS_ROUTE, HOME_ROUTE, LOGIN_ROUTE, MAIL_ROUTE, MESSAGES_ROUTE, PERSONALE_CARD_ROUTE, PERSONALE_ROUTE, REGISTRATION_ROUTE, RESTORE_PROFILE_ROUTE, RULES_ROUTE, VK_CALLBACK_ROUTE, WORKGROUP_ROUTE } from "./utils/consts"
import Home from "./pages/Home"
// import Messages from "./pages/Messages/Messages"
import VkCallback from "./pages/VkCallback"
import Error_Page from "./pages/Error_Page"
import Registration from "./pages/Registration"
import Auth from "./pages/Auth"
import Exit from "./pages/Exit"
import Founders from "./pages/Founders"
import Personale_kard from "./pages/Personale_kard"
import RestoreUser from "./pages/RestoreUser"
import Rules from "./pages/Rules"
import Workgroup from "./pages/Workgroup/Workgroup"
import Mail from "./pages/Mail"
import Messages from "./pages/Messages/Messages.tsx"

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
    {
        path: `${WORKGROUP_ROUTE}/:location`,
        Component: Workgroup
    },
    {
        path: MAIL_ROUTE,
        Component: Mail
    }
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

export const restoreRoutes = [
    {
        path: RESTORE_PROFILE_ROUTE,
        Component: RestoreUser
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
        path: `${PERSONALE_CARD_ROUTE}/:id`,
        Component: Personale_kard
    },
    {
        path: RULES_ROUTE,
        Component: Rules
    },
]

export const errorRoutes = [
    {
        path: ERROR_ROUTE,
        Component: Error_Page
    },
]