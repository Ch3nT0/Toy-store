import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAbout } from "../../services/client/aboutService";
import { getCookie } from "../../helpers/cookie";

function LayoutAdmin() {
  const [aboutUs, setAboutUs] = useState(null);
  const [ordersOpen, setOrdersOpen] = useState(false); // để toggle submenu
  const token = getCookie("admin_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [token, navigate]);

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
      <main className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg border-r border-gray-200 p-6 flex flex-col justify-between">
          <div>
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

              {/* Orders collapsible menu */}
              <div>
                <button
                  onClick={() => setOrdersOpen(!ordersOpen)}
                  className="w-full text-left py-2 px-4 rounded-lg hover:bg-blue-100 flex justify-between items-center transition"
                >
                  Quản lý đơn hàng
                  <span className="text-gray-500">{ordersOpen ? "▾" : "▸"}</span>
                </button>
                {ordersOpen && (
                  <div className="pl-4 mt-1 space-y-1">
                    <NavLink to="/admin/orders/pending" className={navLinkClass}>
                      Pending
                    </NavLink>
                    <NavLink to="/admin/orders/processing" className={navLinkClass}>
                      Processing
                    </NavLink>
                    <NavLink to="/admin/orders/shipping" className={navLinkClass}>
                      Shipping
                    </NavLink>
                    <NavLink to="/admin/orders/delivered" className={navLinkClass}>
                      Delivered
                    </NavLink>
                    <NavLink to="/admin/orders/completed" className={navLinkClass}>
                      Completed
                    </NavLink>
                    <NavLink to="/admin/orders/cancelled" className={navLinkClass}>
                      Cancelled
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink to="/admin/settings" className={navLinkClass}>
                Cài đặt
              </NavLink>
            </nav>
          </div>

          {/* Footer nhỏ sidebar */}
          {aboutUs && (
            <div className="mt-6 text-sm text-gray-500">
              <p>{aboutUs.tenCongty}</p>
              <p>{aboutUs.sdt}</p>
            </div>
          )}
        </aside>

        {/* Content chính */}
        <div className="flex-grow p-6">
          <Outlet />
        </div>
      </main>

      {/* Footer toàn cục */}
      <footer className="bg-black text-white mt-auto">
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
        <div className="bg-black text-white text-center py-3 border-t border-gray-700">
          <p>Copyright © 2025 by ChenDev</p>
        </div>
      </footer>
    </div>
  );
}

export default LayoutAdmin;
