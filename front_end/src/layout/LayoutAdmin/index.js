import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAbout } from "../../services/client/aboutService";

function LayoutAdmin() {
  const [aboutUs, setAboutUs] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      const data = await getAbout();
      setAboutUs(data);
    };
    fetchAbout();
  }, []);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "block py-2 px-4 bg-blue-600 text-white rounded-lg"
      : "block py-2 px-4 hover:bg-blue-100 rounded-lg transition";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Main */}
      <main className="flex flex-grow">
        {/* Sidebar bên trái */}
        <aside className="w-64 bg-white shadow-lg border-r border-gray-200 p-6">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Admin Panel</h2>
          <nav className="space-y-2">
            <NavLink to="/admin/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={navLinkClass}>
              Quản lý sản phẩm
            </NavLink>
            <NavLink to="/admin/users" className={navLinkClass}>
              Quản lý người dùng
            </NavLink>
            <NavLink to="/admin/orders" className={navLinkClass}>
              Quản lý đơn hàng
            </NavLink>
            <NavLink to="/admin/settings" className={navLinkClass}>
              Cài đặt
            </NavLink>
          </nav>
        </aside>

        {/* Content chính */}
        <div className="flex-grow p-6">
          <Outlet />
        </div>
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
              <p>
                <a
                  href={aboutUs.facebook}
                  className="hover:text-blue-600"
                  target="_blank"
                  rel="noreferrer"
                >
                  Facebook
                </a>
              </p>
              <p>
                <a
                  href={aboutUs.instagram}
                  className="hover:text-pink-500"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </p>
              <p>
                <a
                  href={aboutUs.tiktok}
                  className="hover:text-white"
                  target="_blank"
                  rel="noreferrer"
                >
                  TikTok
                </a>
              </p>
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

export default LayoutAdmin;
