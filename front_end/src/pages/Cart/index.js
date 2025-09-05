import React, { useEffect, useState } from "react";
import { getCart, increaseQuantity, decreaseQuantity, removeFromCart } from "../../services/cartService";
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
            if (type === "increase") {
                res = await increaseQuantity(productId);
            } else {
                res = await decreaseQuantity(productId);
            }
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
        <div className="cart-container" style={{ padding: "20px" }}>
            <h2>Giỏ hàng</h2>
            {cart.length === 0 ? (
                <p>Giỏ hàng trống</p>
            ) : (
                <>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            textAlign: "center",
                        }}
                    >
                        <thead style={{ background: "#f5f5f5" }}>
                            <tr>
                                <th style={{ width: "120px" }}>Hình ảnh</th>
                                <th>Sản phẩm</th>
                                <th style={{ width: "120px" }}>Giá gốc</th>
                                <th style={{ width: "100px" }}>Giảm giá</th>
                                <th style={{ width: "120px" }}>Giá sau giảm</th>
                                <th style={{ width: "150px" }}>Số lượng</th>
                                <th style={{ width: "120px" }}>Tổng</th>
                                <th style={{ width: "80px" }}>Xoá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => {
                                const originalPrice = item.productId.price || 0;
                                const discount = item.productId.discount || 0;
                                const discountedPrice = getDiscountedPrice(item);

                                return (
                                    <tr key={item.productId._id} style={{ borderBottom: "1px solid #ddd" }}>
                                        <td>
                                            <img
                                                src={item.productId.images}
                                                alt={item.productId.name}
                                                width="80"
                                            />
                                        </td>
                                        <td>{item.productId.name}</td>
                                        <td>{originalPrice.toLocaleString()} đ</td>
                                        <td>{discount > 0 ? `-${discount}%` : "0%"}</td>
                                        <td>{discountedPrice.toLocaleString()} đ</td>
                                        <td>
                                            <button
                                                onClick={() => updateQuantity(item.productId._id, "decrease")}
                                                style={{ padding: "2px 8px", marginRight: "5px" }}
                                            >
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId._id, "increase")}
                                                style={{ padding: "2px 8px", marginLeft: "5px" }}
                                            >
                                                +
                                            </button>
                                        </td>
                                        <td>{(discountedPrice * item.quantity).toLocaleString()} đ</td>
                                        <td>
                                            <button onClick={() => removeItem(item.productId._id)}>Xoá</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <h3 style={{ textAlign: "right", marginTop: "20px" }}>
                        Tổng tiền: {total.toLocaleString()} đ
                    </h3>
                    <div style={{ textAlign: "right" }}>
                        <button style={{ padding: "10px 20px", marginTop: "10px" }}
                        onClick={() => navigate("/cart/payment")}>
                            Thanh toán
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
