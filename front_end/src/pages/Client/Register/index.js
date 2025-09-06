import { useNavigate } from "react-router-dom";
import { register } from "../../../services/client/userService";
import { useState } from "react";

function Register() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra rỗng
        if (!fullName || !email || !password) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }



        // Gửi request đăng ký
        const option = { fullName, email, password };
        const response = await register(option);

        if (response && response.code === 200) {
            alert("Đăng ký thành công 🎉");
            navigate("/login");
        } else {
            alert(response.message || "Đăng ký không thành công");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
            <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Đăng ký</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input
                            type="text"
                            placeholder="Họ và tên"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <a href="/forgot-password" className="text-green-600 font-semibold hover:underline">
                            Quên mật khẩu?
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                    >
                        Đăng ký
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Đã có tài khoản?
                    <a href="/login" className="text-green-600 font-semibold hover:underline ml-1">
                        Đăng nhập
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Register;
