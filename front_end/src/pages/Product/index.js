import React, { useEffect, useState } from "react";
import { getProduct } from "../../services/productService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateCart } from "../../services/cartService";

function Product() {
    const [products, setProducts] = useState([]);
    const [totalPage, setTotalPage] = useState(1);

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const keyword = searchParams.get("keyword") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getProduct(page, 8, keyword);
                setProducts(res.data);
                setTotalPage(res.totalPage);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [page, keyword]);

    const handleClick = (id) => {
        navigate(`/product/${id}`);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPage) {
            // Cập nhật query param page
            setSearchParams({ keyword, page: newPage });
        }
    };

    const handleAddCart = async (IdProduct) => {
        try {
            const res = await updateCart(IdProduct, 1);
            alert(res.message);
        } catch (error) {
            console.error("Add cart error:", error);
        }
    };

    return (
        <section className="max-w-6xl mx-auto">
            {products.length === 0 ? (
                <p className="text-center text-gray-600">Không tìm thấy sản phẩm phù hợp.</p>
            ) : (
                <>
                    {/* List sản phẩm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col"
                                onClick={() => handleClick(product._id)}
                            >
                                <div className="relative w-full overflow-hidden">
                                    <img
                                        src={product.images}
                                        alt={product.name}
                                        className="w-full h-56 sm:h-64 md:h-72 object-cover rounded-t-2xl transition-transform duration-500 hover:scale-105"
                                    />
                                    {product.discount > 0 && (
                                        <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                                            -{product.discount}%
                                        </span>
                                    )}
                                </div>

                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="text-lg font-bold text-gray-800 truncate">{product.name}</h3>

                                    <div className="mt-2 flex items-baseline gap-2">
                                        {product.discount > 0 ? (
                                            <>
                                                <span className="text-gray-400 line-through text-base">
                                                    {product.price.toLocaleString()}₫
                                                </span>
                                                <span className="text-red-500 font-extrabold text-lg">
                                                    {(product.price * (1 - product.discount / 100)).toLocaleString()}₫
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-red-500 font-extrabold text-lg">
                                                {product.price.toLocaleString()}₫
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-4 flex gap-3">
                                        <button
                                            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-semibold"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddCart(product._id);
                                            }}
                                        >
                                            Thêm vào giỏ
                                        </button>
                                        <button
                                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition font-semibold"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // xử lý mua ngay
                                            }}
                                        >
                                            Mua ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center mt-8 gap-2">
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
                </>
            )}
        </section>
    );
}

export default Product;
