import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCookie } from '../../helpers/cookie';
import { useEffect, useState } from 'react';
import { checkLogin } from '../../actions/login';
import { getAbout } from '../../services/client/aboutService';

function LayoutDefault() {
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => state.login);
    const navigate = useNavigate();

    const [aboutUs, setAboutUs] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        const token = getCookie('token');
        if (token) {
            dispatch(checkLogin(true));
        } else {
            dispatch(checkLogin(false));
        }
    }, [dispatch]);

    useEffect(() => {
        const fetchAbout = async () => {
            const data = await getAbout();
            setAboutUs(data);
        };
        fetchAbout();
    }, []);

    const navLinkClass = ({ isActive }) =>
        isActive
            ? "text-blue-600 border-b-2 border-blue-600 pb-1"
            : "hover:text-blue-500 transition";

    // Hàm xử lý Enter trên thanh tìm kiếm
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (searchKeyword.trim() !== '') {
                navigate(`/product?keyword=${encodeURIComponent(searchKeyword.trim())}`);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
            <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
                <div className="text-2xl font-bold text-blue-600">Toys Store</div>

                {/* Menu + Search */}
                <div className="hidden md:flex items-center space-x-6 font-medium">
                    <nav className="flex space-x-6">
                        <NavLink to="/" className={navLinkClass}>Home</NavLink>
                        <NavLink to="/product" className={navLinkClass}>Sản Phẩm</NavLink>
                        <NavLink to="/cart" className={navLinkClass}>Giỏ hàng</NavLink>
                    </nav>

                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                    />
                </div>

                {/* Account */}
                <div className="space-x-4 font-medium">
                    {isLogin ? (
                        <>
                            <div className="flex items-center space-x-4">
                                {/* Avatar */}
                                <NavLink to="/profile">
                                    <img
                                        src="/user.png"
                                        alt="Avatar"
                                        className="w-10 h-10 rounded-full border border-gray-300 hover:ring-2 hover:ring-blue-400 transition"
                                    />
                                </NavLink>

                                {/* Logout button */}
                                <NavLink
                                    to="/logout"
                                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                                >
                                    Đăng xuất
                                </NavLink>
                            </div>
                        </>

                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                            >
                                Đăng nhập
                            </NavLink>
                            <NavLink
                                to="/register"
                                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                            >
                                Đăng ký
                            </NavLink>
                        </>
                    )}
                </div>
            </header>

            {/* Main */}
            <main className="flex-grow p-6">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-black text-white">
                {aboutUs ? (
                    <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="font-semibold text-lg mb-2">{aboutUs.tenCongty}</h3>
                            <p>SĐT: {aboutUs.sdt}</p>
                            <p>Địa chỉ: {aboutUs.diachi}</p>
                            <p>Email: {aboutUs.email}</p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Mạng xã hội</h4>
                            <p><a href={aboutUs.facebook} className="hover:text-blue-600" target="_blank" rel="noreferrer">Facebook</a></p>
                            <p><a href={aboutUs.instagram} className="hover:text-pink-500" target="_blank" rel="noreferrer">Instagram</a></p>
                            <p><a href={aboutUs.tiktok} className="hover:text-white" target="_blank" rel="noreferrer">TikTok</a></p>
                        </div>

                        <div></div>
                    </div>
                ) : (
                    <p className="text-center py-4">Loading footer...</p>
                )}
            </footer>

            <div className="bg-black text-white text-center py-3 border-t border-gray-700">
                <p>Copyright © 2025 by ChenDev</p>
            </div>
        </div>
    );
}

export default LayoutDefault;
