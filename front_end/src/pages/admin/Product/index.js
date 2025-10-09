import React, { useEffect, useState } from "react";
import { getProduct } from "../../../services/admin/productService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { deleteProduct, updateManyProducts } from "../../../services/admin/productService";

function ProductAdmin() {
    const [products, setProducts] = useState([]);
    const [totalPage, setTotalPage] = useState(1);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [newPrice, setNewPrice] = useState("");
    const [newDiscount, setNewDiscount] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    // bộ lọc giá và giảm giá
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [filterDiscount, setFilterDiscount] = useState("");

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const keyword = searchParams.get("keyword") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const queryMin = searchParams.get("minPrice") || "";
    const queryMax = searchParams.get("maxPrice") || "";
    const queryDiscount = searchParams.get("discount") || "";

    // Lấy danh sách sản phẩm
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getProduct(page, 10, keyword, queryMin, queryMax, queryDiscount);
                setProducts(res.data);
                setTotalPage(res.totalPage);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
        setSearchKeyword(keyword);
        setMinPrice(queryMin);
        setMaxPrice(queryMax);
        setFilterDiscount(queryDiscount);
    }, [page, keyword, queryMin, queryMax, queryDiscount]);

    // Chọn sản phẩm
    const handleSelectProduct = (id) => {
        setSelectedProducts((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map((p) => p._id));
        }
    };

    // Cập nhật hàng loạt
    const handleBulkUpdate = async () => {
        if (selectedProducts.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để cập nhật!");
            return;
        }

        if (!newPrice && !newDiscount) {
            alert("Vui lòng nhập giá mới hoặc giảm giá mới!");
            return;
        }

        const updates = selectedProducts.map((id) => ({
            id,
            ...(newPrice && { price: parseFloat(newPrice) }),
            ...(newDiscount && { discount: parseFloat(newDiscount) }),
        }));

        try {
            const res = await updateManyProducts(updates);
            alert(res.message);

            const refreshed = await getProduct(page, 10, keyword, minPrice, maxPrice, filterDiscount);
            setProducts(refreshed.data);
            setSelectedProducts([]);
            setNewPrice("");
            setNewDiscount("");
        } catch (error) {
            console.error("Bulk update error:", error);
            alert("Có lỗi xảy ra khi cập nhật!");
        }
    };

    // ✅ Sửa & Xóa sản phẩm
    const handleEdit = (id) => navigate(`/admin/products/edit/${id}`);
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) {
            try {
                const data = await deleteProduct(id);
                alert(data.message);
                const res = await getProduct(page, 10, keyword, minPrice, maxPrice, filterDiscount);
                setProducts(res.data);
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    // ✅ Phân trang
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPage) {
            setSearchParams({
                keyword,
                page: newPage,
                minPrice,
                maxPrice,
                discount: filterDiscount,
            });
        }
    };

    // ✅ Tìm kiếm & Lọc
    const handleSearch = () => {
        setSearchParams({
            keyword: searchKeyword,
            page: 1,
            minPrice,
            maxPrice,
            discount: filterDiscount,
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <section className="max-w-6xl mx-auto">
            {/* Tiêu đề */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                    onClick={() => navigate("/admin/products/add")}
                >
                    + Thêm sản phẩm
                </button>
            </div>

            {/* 🔍 Thanh tìm kiếm + lọc */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Nhập tên sản phẩm..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="border p-2 rounded w-64"
                />
                <input
                    type="number"
                    placeholder="Giá từ..."
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="border p-2 rounded w-28"
                />
                <input
                    type="number"
                    placeholder="Đến..."
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="border p-2 rounded w-28"
                />
                <input
                    type="number"
                    placeholder="Giảm giá (%)"
                    value={filterDiscount}
                    onChange={(e) => setFilterDiscount(e.target.value)}
                    className="border p-2 rounded w-32"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-800"
                >
                    Lọc / Tìm kiếm
                </button>
            </div>

            {/* Form cập nhật hàng loạt */}
            <div className="flex items-center gap-3 mb-4">
                <input
                    type="number"
                    placeholder="Giá mới"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="border p-2 rounded w-40"
                />
                <input
                    type="number"
                    placeholder="Giảm giá mới (%)"
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(e.target.value)}
                    className="border p-2 rounded w-40"
                />
                <button
                    onClick={handleBulkUpdate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                    Cập nhật hàng loạt
                </button>
            </div>

            {/* Bảng sản phẩm */}
            {products.length === 0 ? (
                <p className="text-center text-gray-600">Không có sản phẩm nào.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.length === products.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
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
                                    <td className="p-3 border text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.includes(product._id)}
                                            onChange={() => handleSelectProduct(product._id)}
                                        />
                                    </td>
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
