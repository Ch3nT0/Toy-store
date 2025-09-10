import React, { useEffect, useState } from "react";
import { getProduct } from "../../../services/client/productService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteProduct } from "../../../services/admin/productService";

function ProductAdmin() {
    const [products, setProducts] = useState([]);
    const [totalPage, setTotalPage] = useState(1);

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const keyword = searchParams.get("keyword") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getProduct(page, 10, keyword);
                setProducts(res.data);
                setTotalPage(res.totalPage);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [page, keyword]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPage) {
            setSearchParams({ keyword, page: newPage });
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/products/edit/${id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) {
            try {
                const data = await deleteProduct(id);
                alert(data.message);
                const res = await getProduct(page, 10, keyword);
                setProducts(res.data);
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    return (
        <section className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                    onClick={() => navigate("/admin/products/add")}
                >
                    + Thêm sản phẩm
                </button>
            </div>

            {products.length === 0 ? (
                <p className="text-center text-gray-600">Không có sản phẩm nào.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border">Ảnh</th>
                                <th className="p-3 border">Tên</th>
                                <th className="p-3 border">Giá</th>
                                <th className="p-3 border">Giảm giá</th>
                                <th className="p-3 border">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="p-3 border">
                                        <img
                                            src={product.images}
                                            alt={product.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                    </td>
                                    <td className="p-3 border">{product.name}</td>
                                    <td className="p-3 border text-red-600 font-semibold">
                                        {product.price.toLocaleString()}₫
                                    </td>
                                    <td className="p-3 border">{product.discount}%</td>
                                    <td className="p-3 border space-x-2">
                                        <button
                                            onClick={() => handleEdit(product._id)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            Xoá
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 gap-2">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Prev
                </button>

                {Array.from({ length: totalPage }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 rounded ${page === i + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPage}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </section>
    );
}

export default ProductAdmin;
