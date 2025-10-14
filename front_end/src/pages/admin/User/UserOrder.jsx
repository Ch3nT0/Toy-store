import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrdersByUser } from "../../../services/admin/orderService";

export default function UserOrder() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getOrdersByUser(id);
                setOrders(res.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy đơn hàng của user:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [id]);

    if (loading) return <p>Đang tải dữ liệu...</p>;

    return (

        <div className="p-6">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
                ← Quay lại
            </button>
            <h1 className="text-2xl font-bold mb-4">
                Đơn hàng của người dùng ({id})
            </h1>

            {orders.length === 0 ? (
                <p>Người dùng này chưa có đơn hàng nào.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">Mã đơn</th>
                            <th className="border border-gray-300 p-2">Ngày đặt</th>
                            <th className="border border-gray-300 p-2">Tổng tiền</th>
                            <th className="border border-gray-300 p-2">Trạng thái</th>
                            <th className="border border-gray-300 p-2">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-100">
                                <td className="border border-gray-300 p-2">{order._id}</td>
                                <td className="border border-gray-300 p-2">
                                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {order.totalPrice.toLocaleString()} đ
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {order.status}
                                </td>
                                <td className="border border-gray-300 p-2 text-center">
                                    <Link
                                        to={`/admin/orders/detail/${order._id}`}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
