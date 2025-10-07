import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getDash } from "../../../services/admin/dashboardService";
import { useEffect, useState } from "react";
import { getOrder6Months, getOrders } from "../../../services/admin/orderService";

function DashboardAdmin() {
    const [chartData, setChartData] = useState([]);
    const [dash, setDash] = useState([]);
    const [orders, setOrders] = useState([]);

    const statusClasses = {
        completed: "bg-green-100 text-green-600",
        processing: "bg-yellow-100 text-yellow-600",
        cancelled: "bg-red-100 text-red-600",
        delivered: "bg-blue-100 text-blue-600",
        shipping: "bg-purple-100 text-purple-600",
        pending: "bg-gray-100 text-gray-600",
    };

    useEffect(() => {
        const fetchDash = async () => {
            try {
                const res = await getDash();
                setDash(res.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchDash();
    }, []);
    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const res = await getOrder6Months();
                setChartData(res.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchChartData();
    }, []);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getOrders();
                setOrders(res.data || []);
                console.log(res);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchOrders();
    }, []);




    return (
        <div className="space-y-8">
            {/* Thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dash.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center"
                    >
                        <div
                            className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center text-white font-bold text-xl`}
                        >
                            {item.value}
                        </div>
                        <p className="mt-3 text-gray-700 font-medium">{item.title}</p>
                    </div>
                ))}
            </div>

            {/* Biểu đồ doanh thu */}
            <div className="bg-white shadow-md rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Doanh thu 6 tháng gần đây</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 50, bottom: 5 }}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="totalRevenue" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Đơn hàng gần đây */}
            <div className="bg-white shadow-md rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Đơn hàng gần đây</h3>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Mã đơn</th>
                            <th className="p-2 border">Khách hàng</th>
                            <th className="p-2 border">Tổng tiền</th>
                            <th className="p-2 border">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="p-2 border">#{order._id}</td>
                                <td className="p-2 border">{order.client.fullName}</td>
                                <td className="p-2 border">{order.totalPrice}</td>
                                <td className="p-2 border">
                                    <span className={`px-2 py-1 rounded text-sm ${statusClasses[order.status] || "bg-gray-50 text-gray-400"}`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DashboardAdmin;
