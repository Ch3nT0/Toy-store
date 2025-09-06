import { useEffect, useState } from "react";
import { getCart } from "../../../services/client/cartService";
import { getClient, createClient, updateClient } from "../../../services/client/clientService";

function CartPayment() {
  const [cart, setCart] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartRes = await getCart();
        setCart(cartRes.products || []);

        const clientRes = await getClient();
        setClients(clientRes.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const getDiscountedPrice = (item) => {
    const price = item.productId.price || 0;
    const discount = item.productId.discount || 0;
    return Math.round(price * (100 - discount) / 100);
  };

  const total = cart.reduce(
    (sum, item) => sum + getDiscountedPrice(item) * item.quantity,
    0
  );

  const handleSaveClient = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const clientData = {
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    };

    try {
      if (editClient) {
        const res = await updateClient(editClient._id, clientData);
        setClients(clients.map(c => (c._id === editClient._id ? res.data : c)));
      } else {
        const res = await createClient(clientData);
        setClients([...clients, res.data]);
      }
      setShowForm(false);
      setEditClient(null);
    } catch (error) {
      console.error("Lỗi khi lưu client:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handlePayment = () => {
    if (!selectedClient) {
      alert("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }
    console.log("Thanh toán giỏ hàng:", {
      cart,
      client: clients.find(c => c._id === selectedClient),
      paymentMethod,
      total,
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Thanh toán giỏ hàng</h2>

      {/* Danh sách sản phẩm */}
      <div className="bg-white shadow rounded-2xl p-4 mb-8">
        {cart.map((item) => {
          const discountedPrice = getDiscountedPrice(item);
          return (
            <div
              key={item.productId._id}
              className="flex items-center justify-between border-b py-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.productId.images?.[0]}
                  alt={item.productId.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.productId.name}</p>
                  <p className="text-gray-500 text-sm">
                    {discountedPrice.toLocaleString()} đ x {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-semibold text-green-600">
                {(discountedPrice * item.quantity).toLocaleString()} đ
              </p>
            </div>
          );
        })}
        <div className="text-right font-bold text-xl mt-4">
          Tổng cộng: {total.toLocaleString()} đ
        </div>
      </div>

      {/* Địa chỉ giao hàng */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Chọn địa chỉ giao hàng</h3>
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setShowForm(true)}
        >
          + Địa chỉ khác
        </button>
      </div>
      {clients.length > 0 ? (
        <div className="space-y-3 mb-6">
          {clients.map(client => (
            <div
              key={client._id}
              className={`flex justify-between items-center border rounded-lg p-3 ${selectedClient === client._id ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
            >
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="client"
                  value={client._id}
                  checked={selectedClient === client._id}
                  onChange={() => setSelectedClient(client._id)}
                />
                <div>
                  <p className="font-medium">{client.fullName}</p>
                  <p className="text-sm text-gray-600">{client.phone}</p>
                  <p className="text-sm text-gray-600">{client.address}</p>
                </div>
              </label>
              <button
                onClick={() => {
                  setEditClient(client);
                  setShowForm(true);
                }}
                className="text-blue-600 hover:underline"
              >
                Sửa
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6">Bạn chưa có thông tin giao hàng. Hãy thêm mới!</p>
      )}

      {/* Phương thức thanh toán */}
      <h3 className="text-lg font-semibold mb-4">Chọn phương thức thanh toán</h3>
      <div className="space-y-3 mb-6">
        {["COD", "Paypal", "Momo"].map(method => (
          <label
            key={method}
            className={`flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:border-green-500 transition ${paymentMethod === method ? "border-green-500 bg-green-50" : "border-gray-300"
              }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={paymentMethod === method}
              onChange={() => setPaymentMethod(method)}
            />
            <span>{method}</span>
          </label>
        ))}
      </div>

      {/* Form thêm/sửa client */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSaveClient}
            className="bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <h3 className="text-xl font-semibold mb-4">
              {editClient ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
            </h3>
            <input
              name="fullName"
              defaultValue={editClient?.fullName || ""}
              placeholder="Họ và tên"
              className="w-full border p-2 rounded mb-3"
              required
            />
            <input
              name="phone"
              defaultValue={editClient?.phone || ""}
              placeholder="Số điện thoại"
              className="w-full border p-2 rounded mb-3"
              required
            />
            <input
              name="address"
              defaultValue={editClient?.address || ""}
              placeholder="Địa chỉ"
              className="w-full border p-2 rounded mb-3"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditClient(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Nút xác nhận */}
      <button
        onClick={handlePayment}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
      >
        Xác nhận thanh toán
      </button>
    </div>
  );
}

export default CartPayment;
