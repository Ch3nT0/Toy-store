import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductByID, updateProduct } from "../../../services/admin/productService";
import { handleUpload } from "../../../helpers/uploaFileToCloud"; 
import '@google/model-viewer'; 

// Hàm kiểm tra xem URL có phải là link file 3D thô (.glb, .gltf) không
const isRawModelFile = (url) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    // Mở rộng kiểm tra nếu cần (ví dụ: .obj, .stl), nhưng .glb/.gltf là phổ biến nhất cho model-viewer.
    return lowerUrl.endsWith('.glb') || lowerUrl.endsWith('.gltf'); 
};

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isUploading, setIsUploading] = useState(false); 
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);

    /**
     * @description Fetch dữ liệu sản phẩm hiện tại
     */
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await getProductByID(id);
                setProduct(prev => ({
                    ...prev,
                    ...res.data
                })); 
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product:", error);
                alert("Không thể tải dữ liệu sản phẩm.");
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    /**
     * @description Xử lý tải file (image/3d model) lên Cloudinary (Dùng hàm utility)
     */
    const handleUploadFile = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true); 
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
            console.error("Upload error:", err);
        } finally {
            setIsUploading(false); 
        }
    };


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
            if (isUploading) {
                 alert("Vui lòng chờ quá trình upload file hoàn tất.");
                 return;
            }
            const res = await updateProduct(id, product);
            alert(res.message);
            navigate("/admin/products");
        } catch (error) {
            console.error("Update error:", error);
            alert("Có lỗi xảy ra khi cập nhật sản phẩm.");
        }
    };


    if (loading) return <p className="text-center">Đang tải dữ liệu...</p>;

    return (
        <section className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Chỉnh sửa sản phẩm</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tên sản phẩm */}
                <div>
                    <label className="block font-medium mb-1">Tên sản phẩm</label>
                    <input
                        type="text"
                        name="name"
                        value={product.name || ""}
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
                        value={product.price || ""}
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
                        value={product.discount || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                
                {/* Mô tả chi tiết */}
                <div>
                    <label className="block font-medium mb-1">Mô tả chi tiết</label>
                    <textarea
                        name="description"
                        value={product.description || ""}
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
                        value={product.inStock || ""}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>


                {/* --- Ảnh sản phẩm --- */}
                <div>
                    <label className="block font-medium mb-1">Ảnh sản phẩm (Tải lên hoặc URL)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUploadFile(e, "image")}
                        className="w-full mb-2"
                        disabled={isUploading}
                    />
                    <input
                        type="url"
                        name="images"
                        value={product.images || ""}
                        onChange={handleChange}
                        placeholder="Hoặc nhập URL ảnh có sẵn..."
                        className="w-full border rounded px-3 py-2"
                        disabled={isUploading}
                    />
                    {isUploading && <p className="text-sm text-gray-500">Đang upload...</p>}
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
                    <label className="block font-medium mb-1">Model 3D (Tải file hoặc Link)</label>
                    <input
                        type="file"
                        accept=".glb,.gltf,.obj,.stl"
                        onChange={(e) => handleUploadFile(e, "3d")}
                        className="w-full mb-2"
                        disabled={isUploading}
                    />
                    <input
                        type="url"
                        name="model3D"
                        value={product.model3D || ""}
                        onChange={handleChange}
                        placeholder="Hoặc nhập URL Model 3D/Link nhúng Sketchfab..."
                        className="w-full border rounded px-3 py-2"
                        disabled={isUploading}
                    />
                    
                    {isUploading && <p className="text-sm text-gray-500">Đang upload...</p>}
                    
                    {product.model3D && (
                        <div className="mt-3">
                            <p className="text-sm text-gray-500 mb-1">Xem trước mô hình 3D:</p>
                            
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
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={isUploading}
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </form>
        </section>
    );
}

export default EditProduct;
