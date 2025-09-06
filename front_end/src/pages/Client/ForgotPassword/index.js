import { useState } from "react";
import { forgotPassword, verifyOtp, resetPassword } from "../../../services/client/userService";
import { useNavigate } from "react-router-dom";
import {  setCookie } from "../../../helpers/cookie";

function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        const res = await forgotPassword(email);
        if (res.code === 200) {
            alert("Đã gửi OTP, kiểm tra email của bạn");
            setStep(2);
        } else {
            alert(res.message || "Có lỗi xảy ra");
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const res = await verifyOtp(email, otp);
        if (res.code === 200) {
            alert("Xác thực thành công");
            setCookie("token", res.token);
            setStep(3);
        } else {
            alert(res.message || "OTP không hợp lệ");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        const res = await resetPassword(password);
        if (res.code === 200) {
            alert("Đổi mật khẩu thành công, vui lòng đăng nhập lại");
            navigate("/login");
        } else {
            alert(res.message || "Có lỗi xảy ra");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Quên mật khẩu</h2>

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
                        >
                            Gửi OTP
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nhập OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
                        >
                            Xác nhận OTP
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Mật khẩu mới"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
                        >
                            Đặt lại mật khẩu
                        </button>
                    </form>
                )}

                {step > 1 && (
                    <p
                        className="mt-4 text-center text-sm text-gray-500 cursor-pointer hover:underline"
                        onClick={() => setStep(1)}
                    >
                        ← Quay lại nhập email
                    </p>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
