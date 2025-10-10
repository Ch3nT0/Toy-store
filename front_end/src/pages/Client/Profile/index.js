import { useEffect, useState } from "react";
import { getUserByID } from "../../../services/client/userService";
import { getOrderByID, updateOrderStatus } from "../../../services/client/orderService";
import { getProductByID } from "../../../services/client/productService";

function Profile() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [openDetails, setOpenDetails] = useState({});
    const [productDetails, setProductDetails] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getUserByID();
            setUser(data.data);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            const data = await getOrderByID();
            setOrders(data.data);
        };
        fetchOrders();
    }, []);

    const fetchProductDetail = async (productId) => {
        if (productDetails[productId]) return; // đã có thì không tải lại
        try {
            const res = await getProductByID(productId);
            setProductDetails((prev) => ({
                ...prev,
                [productId]: res.data,
            }));
        } catch (error) {
            console.error("Lỗi lấy thông tin sản phẩm:", error);
        }
    };

    const toggleDetail = async (id, products) => {
        setOpenDetails((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));

        // Khi mở chi tiết => tải thông tin sản phẩm
        if (!openDetails[id]) {
            for (const p of products) {
                await fetchProductDetail(p.productId);
            }
        }
    };

    const handleConfirmReceived = async (orderId) => {
        const confirm = window.confirm("Bạn đã chắc chắn nhận được hàng?");
        if (!confirm) return;

        try {
            const result = await updateOrderStatus(orderId, { status: "completed" });
            alert(result.message || "Xác nhận thành công!");
            setOrders((prev) =>
                prev.map((o) =>
                    o._id === orderId ? { ...o, status: "completed" } : o
                )
            );
        } catch (error) {
            console.error("Error confirm received:", error);
            alert("Có lỗi xảy ra khi xác nhận đơn hàng.");
        }
    };

    const handleCancelOrder = async (orderId) => {
        const confirm = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?");
        if (!confirm) return;

        try {
            const result = await updateOrderStatus(orderId, { status: "cancelled" });
            alert(result.message || "Đơn hàng đã được hủy.");
            setOrders((prev) =>
                prev.map((o) =>
                    o._id === orderId ? { ...o, status: "cancelled" } : o
                )
            );
        } catch (error) {
            console.error("Error cancel order:", error);
            alert("Có lỗi xảy ra khi hủy đơn.");
        }
    };

    if (!user) return <p>Đang tải thông tin user...</p>;
    if (!orders) return <p>Đang tải đơn hàng...</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Thông tin user */}
            <div className="mb-6 p-4 border rounded-lg shadow">
                <h2 className="text-xl font-bold mb-2">Thông tin người dùng</h2>
                <p><strong>Tên:</strong> {user.fullName}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>

            {/* Danh sách đơn hàng */}
            <div>
                <h2 className="text-xl font-bold mb-4">Đơn hàng</h2>
                {orders.length === 0 ? (
                    <p>Chưa có đơn hàng nào</p>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order._id}
                            className="mb-6 p-4 border rounded-lg shadow relative"
                        >
                            <p><strong>Mã đơn hàng:</strong> {order._id}</p>
                            <p><strong>Trạng thái:</strong>
                                <span className="ml-2 px-2 py-1 rounded bg-gray-200">{order.status}</span>
                            </p>
                            <p><strong>Thanh toán:</strong> {order.paymentMethod}</p>
                            <p><strong>Tổng tiền:</strong> {order.totalPrice} VND</p>

                            {/* Nút ở dưới bên trái */}
                            <div className="flex justify-between items-end mt-4">
                                <div className="flex gap-3">
                                    {order.status === "delivered" && (
                                        <button
                                            onClick={() => handleConfirmReceived(order._id)}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Đã nhận hàng
                                        </button>
                                    )}

                                    {(order.status === "pending" || order.status === "processing") && (
                                        <button
                                            onClick={() => handleCancelOrder(order._id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Hủy đơn
                                        </button>
                                    )}
                                </div>

                                {/* Nút xem chi tiết ở dưới bên phải */}
                                <button
                                    onClick={() => toggleDetail(order._id, order.products)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    {openDetails[order._id] ? "Ẩn chi tiết" : "Xem chi tiết"}
                                </button>
                            </div>

                            {openDetails[order._id] && (
                                <div className="mt-4 p-3 border rounded bg-gray-50">
                                    <p><strong>Khách hàng:</strong> {order.client.fullName}</p>
                                    <p><strong>Địa chỉ:</strong> {order.client.address}</p>
                                    <p><strong>SĐT:</strong> {order.client.phone}</p>

                                    <h3 className="font-semibold mt-3 mb-2">Sản phẩm:</h3>
                                    <ul className="space-y-3">
                                        {order.products.map((p, idx) => {
                                            const product = productDetails[p.productId];
                                            return (
                                                <li key={idx} className="flex items-center gap-4 border-b pb-2">
                                                    {product?.images && (
                                                        <img
                                                            src={product.images}
                                                            alt={product.name}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            {product?.name || "Đang tải..."}
                                                        </p>
                                                        <p>Số lượng: {p.quantity}</p>
                                                        <p>Giá: {p.price} VND</p>
                                                        <p>Giảm giá: {p.discount}%</p>
                                                        <p><strong>Thành tiền:</strong> {p.totalPrice} VND</p>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Profile;
