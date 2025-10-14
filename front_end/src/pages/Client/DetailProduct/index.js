import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductByID } from "../../../services/client/productService";
import { updateCart } from "../../../services/client/cartService";
import '@google/model-viewer'; // Import thư viện xem 3D

const isRawModelFile = (url) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith('.glb') || lowerUrl.endsWith('.gltf');
};

function DetailProduct() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductByID(id);
                setProduct(data.data);
            } catch (error) {
                console.error("Error fetching product:", error);
                setProduct(null);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddCart = async (IdProduct) => {
        try {

            const res = await updateCart(IdProduct, 1);
            alert(res.message);
        } catch (error) {
            console.error("Add cart error:", error);
            alert("Có lỗi xảy ra khi thêm vào giỏ hàng.");
        }
    };

    if (!product) return <div className="text-center mt-20 text-xl font-semibold text-gray-700">Đang tải chi tiết sản phẩm...</div>;

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-2xl flex flex-col md:flex-row gap-8">

            {/* 🔶 KHU VỰC XEM 3D HOẶC ẢNH LỚN */}
            <div className="w-full md:w-1/2 rounded-lg overflow-hidden shadow-xl" style={{ aspectRatio: "1/1" }}>
                {product.model3D ? (
                    // Hiển thị Model 3D nếu có link
                    <div className="w-full h-full">
                        {isRawModelFile(product.model3D) ? (
                            // CASE 1: File GLB/GLTF thô -> Dùng MODEL-VIEWER
                            <model-viewer
                                src={product.model3D}
                                alt={`Mô hình 3D ${product.name}`}
                                camera-controls
                                auto-rotate
                                shadow
                                ar
                                style={{ width: '100%', height: '100%' }}
                            />
                        ) : (
                            // CASE 2: Link nhúng (Sketchfab,...) -> Dùng IFRAME đã sửa lỗi
                            <iframe
                                src={product.model3D}
                                title={`Mô hình 3D ${product.name}`}
                                className="w-full h-full"
                                allow="autoplay; fullscreen"
                                frameBorder="0"
                            />
                        )}
                    </div>
                ) : (
                    <img
                        src={product.images}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Thông tin sản phẩm */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>

                    <p className="mt-4 text-gray-700 leading-relaxed border-b pb-4">
                        {product.description || 'Sản phẩm chưa có mô tả chi tiết.'}
                    </p>

                    <div className="flex items-center mt-5">
                        <span className="text-red-600 text-3xl font-bold">
                            {(product.price * (1 - (product.discount || 0) / 100)).toLocaleString()}₫
                        </span>
                        {product.discount > 0 && (
                            <span className="ml-3 text-gray-400 line-through text-lg">
                                {product.price.toLocaleString()}₫
                            </span>
                        )}
                        {product.discount > 0 && (
                            <span className="ml-3 px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                                Giảm {product.discount}%
                            </span>
                        )}
                    </div>

                    <div className="flex items-center mt-4 text-sm">
                        <span className="text-yellow-500 mr-2 font-bold">⭐ {product.rating || 5.0}</span>
                        <span className="text-gray-500">({product.reviewCount || 0} đánh giá)</span>
                        <span className="ml-4 text-green-600 font-medium">Còn hàng: {product.inStock || 0}</span>
                    </div>

                </div>

                {/* Nút mua */}
                <div className="mt-8 flex gap-4 border-t pt-6">
                    <button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition shadow-lg shadow-green-200"
                        onClick={() => handleAddCart(product._id)}
                    >
                        🛒 Thêm vào giỏ hàng
                    </button>
                    <button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition shadow-lg shadow-blue-200"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/payment/${product._id}`);
                        }}
                    >
                                Mua ngay
                    </button>
            </div>
        </div>
        </div >
    );
}

export default DetailProduct;
