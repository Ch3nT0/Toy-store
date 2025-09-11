import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getOrders, deleteOrder } from "../../../services/admin/orderService";

function OrderAdmin() {
    const [orders, setOrders] = useState([]);
    const [totalPage, setTotalPage] = useState(1);

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const keyword = searchParams.get("keyword") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getOrders(page, 10, keyword);
                console.log("Orders:", res);
                setOrders(res.data);
                setTotalPage(res.totalPage);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, [page, keyword]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPage) {
            setSearchParams({ keyword, page: newPage });
        }
    };

    const handleDetail = (id) => {
        navigate(`/admin/orders/detail/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xoá đơn hàng này?")) {
            try {
                const data = await deleteOrder(id);
                alert(data.message);
                const res = await getOrders(page, 10, keyword);
                setOrders(res.data);
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    return (
        <section className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
            </div>

            {orders.length === 0 ? (
                <p className="text-center text-gray-600">Không có đơn hàng nào.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border">Mã đơn</th>
                                <th className="p-3 border">Khách hàng</th>
                                <th className="p-3 border">SĐT</th>
                                <th className="p-3 border">Ngày đặt</th>
                                <th className="p-3 border">Tổng tiền</th>
                                <th className="p-3 border">Thanh toán</th>
                                <th className="p-3 border">Trạng thái</th>
                                <th className="p-3 border">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="p-3 border">{order._id}</td>
                                    <td className="p-3 border">{order.client?.fullName}</td>
                                    <td className="p-3 border">{order.client?.phone}</td>
                                    <td className="p-3 border">
                                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td className="p-3 border text-red-600 font-semibold">
                                        {order.totalPrice
                                            ? order.totalPrice.toLocaleString("vi-VN") + "₫"
                                            : "0₫"}
                                    </td>
                                    <td className="p-3 border">{order.paymentMethod}</td>
                                    <td className="p-3 border">{order.status}</td>
                                    <td className="p-3 border space-x-2">
                                        <button
                                            onClick={() => handleDetail(order._id)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            Chi tiết
                                        </button>
                                        <button
                                            onClick={() => handleDelete(order._id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            Xoá
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 gap-2">
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
                        className={`px-3 py-1 rounded ${
                            page === i + 1
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
        </section>
    );
}

export default OrderAdmin;
