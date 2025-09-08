import PrivateRoutes from "../components/PrivateRoutes";
import LayoutDefault from "../layout/LayoutDefault";
import Home from "../pages/Client/Home";
import Login from "../pages/Client/Login";
import Register from "../pages/Client/Register";
import Logout from "../pages/Client/Logout";
import Product from "../pages/Client/Product";
import DetailProduct from "../pages/Client/DetailProduct";
import ForgotPassword from "../pages/Client/ForgotPassword";
import Cart from "../pages/Client/Cart";
import Profile from "../pages/Client/Profile";
import Payment from "../pages/Client/payment";
import PaymenCart from "../pages/Client/paymentCart";
import LayoutAdmin from "../layout/LayoutAdmin";
import DashboardAdmin from "../pages/admin/dashboard";
import ProductAdmin from "../pages/admin/Product";
import UserAdmin from "../pages/admin/User";
import OrderAdmin from "../pages/admin/Order";

const URL_ADMIN = '/admin'

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
                path: "product",
                children: [
                    {
                        index: true,
                        element: <Product />
                    },
                    {
                        path: ":id",
                        element: <DetailProduct />
                    },
                    {
                        path: "payment/:id",
                        element: <Payment />
                    }
                ]
            }
            , {
                path: 'cart',
                element: <Cart />
            }, {
                path: 'cart/payment',
                element: <PaymenCart />
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
    },
    {
        path: URL_ADMIN,
        element: <LayoutAdmin />,
        children: [
            {
                path:'dashboard',
                element: <DashboardAdmin />
            },
            {
                path: 'products', 
                element: <ProductAdmin />
            },
            {
                path: 'users', 
                element: <UserAdmin />
            },
            {
                path: 'orders', 
                element: <OrderAdmin />
            },
        ]
    }
]
