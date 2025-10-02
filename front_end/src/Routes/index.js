import PrivateRoutes from "../components/PrivateRoutes";
import LayoutDefault from "../layout/LayoutDefault";
import Home from "../pages/Client/Home";
import Login from "../pages/Client/Login";
import Register from "../pages/Client/Register";
import Logout from "../pages/Client/Logout";
import Product from "../pages/Client/Product";
import DetailProduct from "../pages/Client/DetailProduct";
import Cart from "../pages/Client/Cart";
import Profile from "../pages/Client/Profile";
import Payment from "../pages/Client/payment";
import PaymenCart from "../pages/Client/paymentCart";
import LayoutAdmin from "../layout/LayoutAdmin";
import DashboardAdmin from "../pages/admin/dashboard";
import ProductAdmin from "../pages/admin/Product";
import UserAdmin from "../pages/admin/User";
import EditProduct from "../pages/admin/EditProduct";
import AddProduct from "../pages/admin/AddProduct";
import SettingAdmin from "../pages/admin/Setting";
import LoginAdmin from "../pages/admin/Login";
import OrderDetail from "../pages/admin/OrderDetail";
import OrderPending from "../pages/admin/Order/OrderPending";
import OrderProcessing from "../pages/admin/Order/OrderProcessing";
import OrderShipping from "../pages/admin/Order/OrderShipping";
import OrderCompleted from "../pages/admin/Order/OrderCompleted";
import OrderCancelled from "../pages/admin/Order/OrderCancelled";
import OrderDelivered from "../pages/admin/Order/OrderDelivered";

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
        path: `${URL_ADMIN}/login`,
        element: <LoginAdmin />
    }, {
        path: URL_ADMIN,
        element: <LayoutAdmin />,
    },
    {
        path: URL_ADMIN,
        element: <LayoutAdmin />,
        children: [

            {
                path: 'dashboard',
                element: <DashboardAdmin />
            },
            {
                path: 'products',
                element: <ProductAdmin />
            }, {
                path: 'products/edit/:id',
                element: <EditProduct />
            }, {
                path: 'products/add',
                element: <AddProduct />
            },
            {
                path: 'users',
                element: <UserAdmin />
            },
            {
                path: 'orders/pending',
                element: <OrderPending />
            },
            {
                path: 'orders/processing',
                element: <OrderProcessing />
            },
            {
                path: 'orders/shipping',
                element: <OrderShipping />
            },
            {
                path: 'orders/completed',
                element: <OrderCompleted />
            },
            {
                path: 'orders/cancelled',
                element: <OrderCancelled />
            },{
                path: 'orders/delivered',
                element: <OrderDelivered />
            },
            {
                path: 'orders/detail/:id',
                element: <OrderDetail />
            }, {
                path: 'settings',
                element: <SettingAdmin />
            },
        ]
    }
]
