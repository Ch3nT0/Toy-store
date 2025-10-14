import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../../services/admin/productService";
import { handleUpload } from "../../../helpers/uploaFileToCloud";
import '@google/model-viewer'; 

// Hàm kiểm tra xem URL có phải là link file 3D thô (.glb, .gltf) không
const isRawModelFile = (url) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith('.glb') || lowerUrl.endsWith('.gltf'); 
};

function AddProduct() {
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        price: "",
        discount: "",
        description: "",
        // THÊM TRƯỜNG CÒN HÀNG
        inStock: "", 
        images: "",
        model3D: "",
    });

    const [loading, setLoading] = useState(false);

    /**
     * @description Xử lý tải file (image/3d model) lên Cloudinary
     */
    const handleUploadFile = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setProduct((prev) => ({
            ...prev,
            [type === "3d" ? "model3D" : "images"]: "",
        }));

        try {
            const secureUrl = await handleUpload(file, type);

            if (secureUrl) {
                setProduct((prev) => ({
                    ...prev,
                    [type === "3d" ? "model3D" : "images"]: secureUrl,
                }));
            } else {
                alert("Tải lên file thất bại. Vui lòng kiểm tra console.");
            }

        } catch (err) {
            alert(`Tải lên thất bại: ${err.message}`);
            console.error("Component upload flow error:", err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * @description Xử lý thay đổi input text (Bao gồm cả nhập URL thủ công)
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * @description Xử lý gửi form (Tạo sản phẩm mới)
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (loading) {
                 alert("Vui lòng chờ quá trình upload file hoàn tất.");
                 return;
            }
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
                
                {/* Mô tả chi tiết */}
                <div>
                    <label className="block font-medium mb-1">Mô tả chi tiết</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full border rounded px-3 py-2 resize-none"
                    />
                </div>
                
                {/* 🌟 CÒN HÀNG (IN STOCK) 🌟 */}
                <div>
                    <label className="block font-medium mb-1">Số lượng còn hàng</label>
                    <input
                        type="number"
                        name="inStock"
                        value={product.inStock}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>


                {/* Ảnh sản phẩm (Tải file hoặc Gắn URL) */}
                <div>
                    <label className="block font-medium mb-1">Ảnh sản phẩm</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadFile(e, "image")}
                        className="w-full mb-2"
                        disabled={loading}
                    />
                    <input
                        type="url"
                        name="images"
                        value={product.images}
                        onChange={handleChange}
                        placeholder="Hoặc nhập URL ảnh có sẵn..."
                        className="w-full border rounded px-3 py-2"
                        disabled={loading}
                    />

                    {loading && <p className="text-sm text-gray-500">Đang upload...</p>}
                    {product.images && (
                        <img
                            src={product.images}
                            alt="Preview"
                            className="w-32 h-32 object-cover mt-2 rounded"
                        />
                    )}
                </div>

                {/* --- Model 3D (Phân biệt giữa file thô và link nhúng) --- */}
                <div>
                    <label className="block font-medium mb-1">Model 3D (.glb, .gltf...)</label>
                    <input
                        type="file"
                        accept=".glb,.gltf,.obj,.stl"
                        onChange={(e) => handleUploadFile(e, "3d")}
                        className="w-full mb-2"
                        disabled={loading}
                    />
                    <input
                        type="url"
                        name="model3D"
                        value={product.model3D}
                        onChange={handleChange}
                        placeholder="Hoặc nhập URL Model 3D có sẵn..."
                        className="w-full border rounded px-3 py-2"
                        disabled={loading}
                    />

                    {loading && <p className="text-sm text-gray-500">Đang upload...</p>}

                    {product.model3D && (
                        <div className="mt-3">
                            <p className="text-sm text-gray-500 mb-1">Xem trước mô hình 3D:</p>
                            
                            {/* Logic Phân biệt */}
                            {isRawModelFile(product.model3D) ? (
                                // CASE 1: File GLB/GLTF thô -> Dùng MODEL-VIEWER
                                <model-viewer
                                    src={product.model3D}
                                    alt="Mô hình 3D sản phẩm"
                                    camera-controls
                                    auto-rotate
                                    shadow
                                    ar
                                    style={{ width: '100%', height: '320px', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                                >
                                </model-viewer>
                            ) : (
                                // CASE 2: Link nhúng (ví dụ: Sketchfab embed) -> Dùng IFRAME đã sửa lỗi
                                <iframe
                                    src={product.model3D}
                                    title="3D Model Preview"
                                    className="w-full h-80 rounded-lg border"
                                    allow="autoplay; fullscreen" 
                                    frameBorder="0"
                                ></iframe>
                            )}
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
                        disabled={loading}
                    >
                        Thêm sản phẩm
                    </button>
                </div>
            </form>
        </section>
    );
}

export default AddProduct;
