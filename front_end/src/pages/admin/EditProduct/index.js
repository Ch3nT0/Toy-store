import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductByID, updateProduct } from "../../../services/admin/productService";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        price: "",
        discount: "",
        images: "",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await getProductByID(id);
                setProduct(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product:", error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

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
            const tmp=await updateProduct(id, product);
            alert(tmp.message);
            navigate("/admin/products");
        } catch (error) {
            console.error("Update error:", error);
            alert("Có lỗi xảy ra khi cập nhật sản phẩm.");
        }
    };

    if (loading) {
        return <p className="text-center">Đang tải dữ liệu...</p>;
    }

    return (
        <section className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Chỉnh sửa sản phẩm</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </form>
        </section>
    );
}

export default EditProduct;
