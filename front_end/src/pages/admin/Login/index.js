import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkLogin } from "../../../actions/login";
import { setCookie } from "../../../helpers/cookie";
import { loginAdmin } from "../../../services/admin/adminService"; // service login cho admin

function LoginAdmin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        const response = await loginAdmin(email, password);

        if (response.code === 200) {
            dispatch(checkLogin(true));
            setCookie("admin_token", response.token); // cookie riêng cho admin
            navigate("/admin/dashboard"); // điều hướng tới trang admin
        } else {
            alert(response.message || "Sai tài khoản hoặc mật khẩu admin");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 via-teal-500 to-blue-500">
            <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Đăng nhập Admin</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input 
                            type="email" 
                            placeholder="Email Admin" 
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Mật khẩu Admin" 
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                    >
                        Đăng nhập
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginAdmin;
