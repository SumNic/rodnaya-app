import Admin from "./pages/Admin"
import Auth from "./pages/Auth"
import Personale_page from "./pages/Personale_page"
import { ADMIN_ROUTE, EXIT_ROUTE, HOME_ROUTE, LOGIN_ROUTE, MESSAGES_ROUTE, NEXT_REGISTR_STEP_ROUTE, PERSONALE_ROUTE, REGISTRATION_ROUTE, VK_CALLBACK_ROUTE, VK_ROUTE } from "./utils/consts"
import Home from "./pages/Home"
import Messages from "./pages/Messages"
import Registration from "./pages/Registration"
import NextStepRegistr from "./pages/NextStepRegistr"
import VkCallback from "./pages/VkCallback"

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: PERSONALE_ROUTE,
        Component: Personale_page
    },
    {
        path: MESSAGES_ROUTE,
        Component: Messages
    },
    {
        path: EXIT_ROUTE,
        Component: Auth
    },
]

export const conditionRoutes = [
    // {
    //     path: VK_ROUTE,
    //     Component: RegistrationVK
    // },
    {
        path: NEXT_REGISTR_STEP_ROUTE,
        Component: NextStepRegistr
    },
]

export const publicRoutes = [
    {
        path: HOME_ROUTE,
        Component: Home
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Registration
    },
    {
        path: VK_CALLBACK_ROUTE,
        Component: VkCallback
    },   
]