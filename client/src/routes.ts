import Admin from "./pages/Admin"
import Auth from "./pages/Auth"
import Personale_page from "./pages/Personale_page"
import { ADMIN_ROUTE, ERROR_ROUTE, EXIT_ROUTE, HOME_ROUTE, MESSAGES_ROUTE, NEXT_REGISTR_STEP_ROUTE, PERSONALE_ROUTE, VK_CALLBACK_ROUTE } from "./utils/consts"
import Home from "./pages/Home"
import Messages from "./pages/Messages"
import NextStepRegistr from "./pages/NextStepRegistr"
import VkCallback from "./pages/VkCallback"
import Error_Page from "./pages/Error_Page"

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
    // {
    //     path: LOGIN_ROUTE,
    //     Component: Auth
    // },
    // {
    //     path: REGISTRATION_ROUTE,
    //     Component: Registration
    // },
    {
        path: VK_CALLBACK_ROUTE,
        Component: VkCallback
    },   
]

export const errorRoutes = [
    {
        path: ERROR_ROUTE,
        Component: Error_Page
    },   
]