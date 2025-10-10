import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createClient, getClient, updateClient } from "../../../services/client/clientService";
import { getProductByID } from "../../../services/client/productService";
import { orderProduct } from "../../../services/client/orderService";

function Payment() {
    const { id } = useParams();
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [product, setProduct] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [showForm, setShowForm] = useState(false);
    const [editClient, setEditClient] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientRes = await getClient();
                setClients(clientRes.data || []);

                const productRes = await getProductByID(id);
                setProduct(productRes.data);
            } catch (error) {
                console.error("Lỗi khi fetch:", error);
            }
        };
        fetchData();
    }, [id]);

    const handlePayment = async () => {
        if (!selectedClient) {
            alert("Vui lòng chọn địa chỉ giao hàng!");
            return;
        }
        const clientInfo = clients.find(c => c._id === selectedClient);
        try {
            const res = await orderProduct({
                product,
                client: clientInfo,
                paymentMethod,
                quantity,
            });

            if (res.code === 201 || res.message === "Đặt hàng thành công") {
                alert("Đặt hàng thành công!");
                navigate(`/`);
            } else {
                alert(res.message || "Có lỗi xảy ra khi đặt hàng");
            }
        } catch (error) {
            console.error("Thanh toán thất bại:", error);
            alert("Thanh toán thất bại, vui lòng thử lại!");
        }
    };

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
    console.log({ product });
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Thanh toán sản phẩm</h2>

            {/* Thông tin sản phẩm */}
            {product && (
                <div className="flex gap-6 bg-white shadow rounded-2xl p-4 mb-8">
                    <img
                        src={product.images}
                        alt={product.name}
                        className="w-40 h-40 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold">{product.name}</h3>
                        <p className="text-gray-500 mt-2">
                            Giá gốc: <span className="line-through">{product.price}đ</span>
                        </p>
                        <p className="text-red-500 font-bold text-lg">
                            Giá KM: {product.price - (product.price * (product.discount || 0) / 100)}đ
                        </p>
                        {product.discount > 0 && (
                            <span className="inline-block bg-red-100 text-red-600 px-3 py-1 text-sm rounded mt-2">
                                -{product.discount}%
                            </span>
                        )}

                        {/* Số lượng */}
                        <div className="mt-4 flex items-center gap-3">
                            <span className="font-medium">Số lượng:</span>
                            <div className="flex items-center border rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="px-3 py-1 text-lg"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-16 text-center border-l border-r"
                                />
                                <button
                                    type="button"
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="px-3 py-1 text-lg"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Tổng tiền */}
                        <p className="mt-4 text-lg font-semibold text-green-600">
                            Tổng tiền:{" "}
                            {(product.price - (product.price * (product.discount || 0) / 100)) * quantity}đ
                        </p>
                    </div>
                </div>
            )}


            {/* Chọn client */}
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

export default Payment;
