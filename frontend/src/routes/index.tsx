import Dashboard from "../components/Dashboard";
import LoginPage from "../components/LoginPage";
import LogoutPage from "../components/LogoutPage";
import UserSettings from "../components/UserSettings";

export function getAuthorized(view: any, authenticated: Boolean){
    return authenticated ? view : <LoginPage />
  }

const routes = [
    {
        path: '/',
        element: <LoginPage />,
        requiresAuth: false,
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
        requiresAuth: true,
    },
    {
        path: '/logout',
        element: <LogoutPage />,
        requiresAuth: false,
    },
    {
        path: '/settings',
        element: <UserSettings />,
        requiresAuth: true,
    },
]

export default routes;