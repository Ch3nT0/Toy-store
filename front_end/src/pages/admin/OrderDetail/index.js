import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../../../services/admin/orderService";
import { getProductByID } from "../../../services/admin/productService";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Lấy thông tin order
        const res = await getOrderById(id);

        // Fetch thêm chi tiết sản phẩm cho từng item
        const productsWithDetail = await Promise.all(
          res.products.map(async (p) => {
            const productDetail = await getProductByID(p.productId);
            return {
              ...p,
              product: productDetail.data, 
            };
          })
        );

        // Cập nhật state order kèm product detail
        setOrder({ ...res, products: productsWithDetail });
      } catch (error) {
        console.error("Error fetching order detail:", error);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) {
    return <p className="text-center mt-10">Đang tải dữ liệu...</p>;
  }

  return (
    <section className="max-w-4xl mx-auto p-6 bg-white shadow rounded-xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Quay lại
      </button>

      <h2 className="text-2xl font-bold mb-4">Chi tiết đơn hàng</h2>

      {/* Thông tin đơn hàng */}
      <div className="space-y-2 mb-6">
        <p><strong>Mã đơn:</strong> {order._id}</p>
        <p><strong>Khách hàng:</strong> {order.client?.fullName}</p>
        <p><strong>SĐT:</strong> {order.client?.phone}</p>
        <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleString("vi-VN")}</p>
        <p><strong>Trạng thái:</strong> {order.status}</p>
        <p><strong>Thanh toán:</strong> {order.paymentMethod}</p>
        <p><strong>Tổng tiền:</strong> {order.totalPrice?.toLocaleString("vi-VN")}₫</p>
      </div>

      {/* Sản phẩm trong đơn */}
      <h3 className="text-xl font-semibold mb-3">Danh sách sản phẩm</h3>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Tên sản phẩm</th>
              <th className="p-3 border">Số lượng</th>
              <th className="p-3 border">Giá</th>
              <th className="p-3 border">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.products?.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border">{item.product?.name}</td>
                <td className="p-3 border">{item.quantity}</td>
                <td className="p-3 border">{item.product?.price?.toLocaleString("vi-VN")}₫</td>
                <td className="p-3 border text-red-600 font-semibold">
                  {(item.product?.price * item.quantity).toLocaleString("vi-VN")}₫
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default OrderDetail;
