import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders, updateOrderStatus } from "../../../services/admin/orderService";

export default function OrderList({ status }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const fetchOrders = async (currentPage = 1) => {
        try {
            setLoading(true);
            const res = await getOrders(status, currentPage);

            // Giả sử API trả về { data: [...], totalPages: n }
            setOrders(res.data || []);
            setTotalPage(res.totalPages || 1);
        } catch (err) {
            console.error("Lỗi load đơn hàng:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, page]);

    const handleUpdateStatus = async (orderId, currentStatus) => {
        let nextStatus;
        switch (currentStatus) {
            case "pending":
                nextStatus = "processing";
                break;
            case "processing":
                nextStatus = "shipping";
                break;
            case "shipping":
                nextStatus = "delivered";
                break;
            case "delivered":
                nextStatus = "completed";
                break;
            default:
                return;
        }

        if (window.confirm(`Bạn có chắc muốn chuyển đơn hàng này sang "${nextStatus}"?`)) {
            try {
                await updateOrderStatus(orderId, nextStatus);
                fetchOrders(page);
                alert(`Cập nhật trạng thái thành công: ${nextStatus}`);
            } catch (err) {
                console.error("Cập nhật trạng thái thất bại:", err);
                alert("Cập nhật trạng thái thất bại!");
            }
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPage) {
            setPage(newPage);
        }
    };

    if (loading) return <p>Đang tải đơn hàng...</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                Danh sách đơn hàng ({status})
            </h2>

            {orders.length === 0 ? (
                <p>Không có đơn hàng nào.</p>
            ) : (
                <>
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">Mã đơn</th>
                                <th className="p-2 border">Khách hàng</th>
                                <th className="p-2 border">Số sản phẩm</th>
                                <th className="p-2 border">Tổng tiền</th>
                                <th className="p-2 border">Trạng thái</th>
                                <th className="p-2 border">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="p-2 border">{order._id}</td>
                                    <td className="p-2 border">{order.client?.fullName}</td>
                                    <td className="p-2 border">{order.products?.length}</td>
                                    <td className="p-2 border">
                                        {order.totalPrice.toLocaleString()} đ
                                    </td>
                                    <td className="p-2 border">{order.status}</td>
                                    <td className="p-2 border flex gap-2">
                                        <Link
                                            to={`/admin/orders/detail/${order._id}`}
                                            className="px-2 py-1 bg-blue-500 text-white rounded"
                                        >
                                            Xem chi tiết
                                        </Link>

                                        {order.status !== "completed" &&
                                            order.status !== "delivered" &&
                                            order.status !== "cancelled" && (
                                                <button
                                                    onClick={() =>
                                                        handleUpdateStatus(order._id, order.status)
                                                    }
                                                    className="px-2 py-1 bg-green-500 text-white rounded"
                                                >
                                                    {order.status === "pending" && "Chấp nhận"}
                                                    {order.status === "processing" && "Đưa vận chuyển"}
                                                    {order.status === "shipping" && "Đã giao"}
                                                </button>
                                            )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* --- PHÂN TRANG --- */}
                    <div className="flex justify-center items-center mt-4 gap-2">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPage }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-1 rounded ${page === i + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPage}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
