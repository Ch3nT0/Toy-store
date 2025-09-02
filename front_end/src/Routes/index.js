import PrivateRoutes from "../components/PrivateRoutes";
import LayoutDefault from "../layout/LayoutDefault";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Logout from "../pages/Logout";
import Product from "../pages/Product";
import DetailProduct from "../pages/DetailProduct";
import ForgotPassword from "../pages/ForgotPassword";
import Cart from "../pages/Cart";
import Profile from "../pages/Profile";

export const routes = [
    {
        path: '/',
        element: <LayoutDefault />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: 'logout',
                element: <Logout />
            },
            {
                path: 'product',
                element: <Product />
            },
            {
                path: 'product/:id',
                element: <DetailProduct />
            }, {
                path: 'cart',
                element: <Cart />
            },
            {
                element: <PrivateRoutes />,
                children: [
                    {
                        path: 'profile',
                        element: <Profile />
                    },
                ]
            }
        ]
    },
    {
        path: 'login',
        element: <Login />
    },
    {
        path: 'register',
        element: <Register />
    },
    {
        path: 'forgot-password',
        element: <ForgotPassword />
    }
]
