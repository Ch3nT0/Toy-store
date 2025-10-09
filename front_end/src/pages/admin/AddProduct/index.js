import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../../services/admin/productService";

function AddProduct() {
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        price: "",
        discount: "",
        images: "",
        model3D: "", // ✅ thêm trường model3D
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createProduct(product);
            alert(res.message || "Thêm sản phẩm thành công!");
            navigate("/admin/products");
        } catch (error) {
            console.error("Create error:", error);
            alert("Có lỗi xảy ra khi thêm sản phẩm.");
        }
    };

    return (
        <section className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Thêm sản phẩm mới</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tên sản phẩm */}
                <div>
                    <label className="block font-medium mb-1">Tên sản phẩm</label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                {/* Giá */}
                <div>
                    <label className="block font-medium mb-1">Giá</label>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                {/* Giảm giá */}
                <div>
                    <label className="block font-medium mb-1">Giảm giá (%)</label>
                    <input
                        type="number"
                        name="discount"
                        value={product.discount}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Ảnh sản phẩm */}
                <div>
                    <label className="block font-medium mb-1">Ảnh (URL)</label>
                    <input
                        type="text"
                        name="images"
                        value={product.images}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                    {product.images && (
                        <img
                            src={product.images}
                            alt="Preview"
                            className="w-32 h-32 object-cover mt-2 rounded"
                        />
                    )}
                </div>

                {/* 🔹 Model 3D */}
                <div>
                    <label className="block font-medium mb-1">Model 3D (Link nhúng)</label>
                    <input
                        type="text"
                        name="model3D"
                        value={product.model3D}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="VD: https://sketchfab.com/models/xxxxx/embed"
                    />
                    {product.model3D && (
                        <div className="mt-3">
                            <p className="text-sm text-gray-500 mb-1">Xem trước mô hình 3D:</p>
                            <iframe
                                src={product.model3D}
                                title="3D Model Preview"
                                className="w-full h-80 rounded-lg border"
                                allow="autoplay; fullscreen; vr"
                                frameBorder="0"
                            ></iframe>
                        </div>
                    )}
                </div>

                {/* Nút hành động */}
                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/products")}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Quay lại
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Thêm sản phẩm
                    </button>
                </div>
            </form>
        </section>
    );
}

export default AddProduct;
