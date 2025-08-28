import { checkLogin } from "../../actions/login";
import { login } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCookie } from "../../helpers/cookie";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        const response = await login(email, password);

        if (response.code === 200) {
            dispatch(checkLogin(true));
            setCookie("token", response.token);
            navigate("/");
        } else {
            alert(response.message || "Sai tài khoản hoặc mật khẩu");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Đăng nhập</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Mật khẩu" 
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <a href="/forgot-password" className="text-indigo-600 font-semibold hover:underline">
                            Quên mật khẩu?
                        </a>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
                    >
                        Đăng nhập
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Chưa có tài khoản? 
                    <a href="/register" className="text-indigo-600 font-semibold hover:underline ml-1">
                        Đăng ký
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Login;
