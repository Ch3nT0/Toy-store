import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getDash } from "../../../services/admin/dashboardService";
import { useEffect, useState } from "react";

function DashboardAdmin() {

    const [dash, setDash] = useState([]);

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

    const chartData = [
        { month: "Jan", sales: 4000 },
        { month: "Feb", sales: 3000 },
        { month: "Mar", sales: 5000 },
        { month: "Apr", sales: 4780 },
        { month: "May", sales: 5890 },
        { month: "Jun", sales: 4390 },
    ];

    const orders = [
        { id: 1, user: "Nguyễn Văn A", total: "500.000đ", status: "Hoàn tất" },
        { id: 2, user: "Trần Thị B", total: "1.200.000đ", status: "Đang xử lý" },
        { id: 3, user: "Lê Văn C", total: "300.000đ", status: "Đang giao" },
    ];

    return (
        <div className="space-y-8">
            {/* Thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dash.map((item, index) => (
                    <div key={index} className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center">
                        <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
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
                    <BarChart data={chartData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales" fill="#3b82f6" />
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
                                <td className="p-2 border">#{order.id}</td>
                                <td className="p-2 border">{order.user}</td>
                                <td className="p-2 border">{order.total}</td>
                                <td className="p-2 border">
                                    <span
                                        className={`px-2 py-1 rounded text-sm ${order.status === "Hoàn tất"
                                            ? "bg-green-100 text-green-600"
                                            : order.status === "Đang xử lý"
                                                ? "bg-yellow-100 text-yellow-600"
                                                : "bg-blue-100 text-blue-600"
                                            }`}
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
