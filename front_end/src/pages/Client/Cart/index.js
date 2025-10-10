import React, { useEffect, useState } from "react";
import {
    getCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
} from "../../../services/client/cartService";
import { useNavigate } from "react-router-dom";

function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await getCart();
            if (res.code === 200) {
                setCart(res.products || []);
            }
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng:", error);
        }
    };

    const updateQuantity = async (productId, type) => {
        try {
            let res;
            if (type === "increase") res = await increaseQuantity(productId);
            else res = await decreaseQuantity(productId);
            if (res.code === 200) setCart(res.products || []);
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng:", error);
        }
    };

    const removeItem = async (productId) => {
        try {
            await removeFromCart(productId);
            fetchCart();
        } catch (error) {
            console.error("Lỗi khi xoá sản phẩm:", error);
        }
    };

    const getDiscountedPrice = (item) => {
        const price = item.productId.price || 0;
        const discount = item.productId.discount || 0;
        return Math.round(price * (100 - discount) / 100);
    };

    const total = cart.reduce(
        (sum, item) => sum + getDiscountedPrice(item) * item.quantity,
        0
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                🛒 Giỏ hàng của bạn
            </h2>

            {cart.length === 0 ? (
                <div className="text-center text-gray-600 text-lg mt-10">
                    Giỏ hàng trống.
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
                                <th className="py-3 px-2">Hình ảnh</th>
                                <th className="py-3 px-2">Sản phẩm</th>
                                <th className="py-3 px-2">Giá gốc</th>
                                <th className="py-3 px-2">Giảm giá</th>
                                <th className="py-3 px-2">Giá sau giảm</th>
                                <th className="py-3 px-2">Số lượng</th>
                                <th className="py-3 px-2">Tổng</th>
                                <th className="py-3 px-2">Xoá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => {
                                const originalPrice = item.productId.price || 0;
                                const discount = item.productId.discount || 0;
                                const discountedPrice = getDiscountedPrice(item);

                                return (
                                    <tr
                                        key={item.productId._id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="py-3 px-2">
                                            <img
                                                src={item.productId.images}
                                                alt={item.productId.name}
                                                className="w-20 h-20 object-cover rounded-xl mx-auto"
                                            />
                                        </td>
                                        <td className="text-gray-800 font-semibold">
                                            {item.productId.name}
                                        </td>
                                        <td className="text-gray-500">
                                            {originalPrice.toLocaleString()} đ
                                        </td>
                                        <td className="text-red-500 font-semibold">
                                            {discount > 0 ? `-${discount}%` : "0%"}
                                        </td>
                                        <td className="text-green-600 font-bold">
                                            {discountedPrice.toLocaleString()} đ
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.productId._id,
                                                            "decrease"
                                                        )
                                                    }
                                                    className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                                                >
                                                    -
                                                </button>
                                                <span className="text-gray-800 font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.productId._id,
                                                            "increase"
                                                        )
                                                    }
                                                    className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="text-blue-600 font-bold">
                                            {(discountedPrice * item.quantity).toLocaleString()} đ
                                        </td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    removeItem(item.productId._id)
                                                }
                                                className="text-red-500 hover:text-red-700 font-semibold transition"
                                            >
                                                ✖
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="flex justify-end mt-6">
                        <div className="text-right">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Tổng tiền:{" "}
                                <span className="text-red-600">
                                    {total.toLocaleString()} đ
                                </span>
                            </h3>
                            <button
                                onClick={() => navigate("/cart/payment")}
                                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition"
                            >
                                Thanh toán ngay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
