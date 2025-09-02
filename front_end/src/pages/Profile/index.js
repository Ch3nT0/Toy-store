import { useEffect, useState } from "react";
import { getUserByID } from "../../services/userService";
import { getOrderByID } from "../../services/orderService";

function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [openDetails, setOpenDetails] = useState({}); // Lưu trạng thái mở/đóng chi tiết

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
      setOrders(data.data); // giả sử trả về mảng order
    };
    fetchOrders();
  }, []);

  const toggleDetail = (id) => {
    setOpenDetails((prev) => ({
      ...prev,
      [id]: !prev[id], // đảo trạng thái mở/đóng
    }));
  };

  if (!user) return <p>Đang tải thông tin user...</p>;
  if (!orders) return <p>Đang tải đơn hàng...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Thông tin user */}
      <div className="mb-6 p-4 border rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Thông tin người dùng</h2>
        <p><strong>Tên:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      {/* Danh sách đơn hàng */}
      <div>
        <h2 className="text-xl font-bold mb-4">Đơn hàng</h2>
        {orders.length === 0 ? (
          <p>Chưa có đơn hàng nào</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="mb-6 p-4 border rounded-lg shadow">
              <p><strong>Mã đơn hàng:</strong> {order._id}</p>
              <p><strong>Trạng thái:</strong> {order.status}</p>
              <p><strong>Thanh toán:</strong> {order.paymentMethod}</p>
              <p><strong>Tổng tiền:</strong> {order.totalPrice} VND</p>

              <button
                onClick={() => toggleDetail(order._id)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {openDetails[order._id] ? "Ẩn chi tiết" : "Xem chi tiết"}
              </button>

              {openDetails[order._id] && (
                <div className="mt-4 p-3 border rounded bg-gray-50">
                  <p><strong>Khách hàng:</strong> {order.client.fullName}</p>
                  <p><strong>Địa chỉ:</strong> {order.client.address}</p>
                  <p><strong>SĐT:</strong> {order.client.phone}</p>

                  <h3 className="font-semibold mt-3">Sản phẩm:</h3>
                  <ul className="list-disc ml-6">
                    {order.products.map((p, idx) => (
                      <li key={idx}>
                        <p><strong>Sản phẩm ID:</strong> {p.productId}</p>
                        <p>Số lượng: {p.quantity}</p>
                        <p>Giá: {p.price} VND</p>
                        <p>Giảm giá: {p.discount}%</p>
                        <p><strong>Thành tiền:</strong> {p.totalPrice} VND</p>
                      </li>
                    ))}
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
