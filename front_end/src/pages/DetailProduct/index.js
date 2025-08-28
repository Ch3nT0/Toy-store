import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductByID } from "../../services/productService";

function DetailProduct() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductByID(id);
            setProduct(data.data);
        };
        fetchProduct();
    }, [id]);

    if (!product) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg flex flex-col md:flex-row gap-8">
            {/* Ảnh sản phẩm */}
            <div className="sketchfab-embed-wrapper w-full md:w-1/2" style={{ aspectRatio: "16/9" }}>
                <iframe
                    title="Muscle Car low poly"
                    frameBorder="0"
                    allowFullScreen
                    mozallowfullscreen="true"
                    webkitallowfullscreen="true"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    xr-spatial-tracking
                    execution-while-out-of-viewport
                    execution-while-not-rendered
                    web-share
                    src={product.model3D}
                    className="w-full h-full rounded-lg"
                ></iframe>
            </div>


            {/* Thông tin sản phẩm */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                    <p className="text-gray-500 mt-1">Thương hiệu: {product.brand}</p>

                    <div className="flex items-center mt-4">
                        <span className="text-red-500 text-2xl font-semibold">
                            {product.price.toLocaleString()}₫
                        </span>
                        {product.discount > 0 && (
                            <span className="ml-3 text-gray-400 line-through">
                                {(product.price / (1 - product.discount / 100)).toLocaleString()}₫
                            </span>
                        )}
                    </div>

                    <p className="mt-4 text-gray-700">{product.description}</p>

                    <div className="flex items-center mt-4">
                        <span className="text-yellow-400 mr-2">⭐ {product.rating}</span>
                        <span className="text-gray-500">({product.reviewCount} đánh giá)</span>
                    </div>

                    <p className="mt-2 text-gray-500">Còn lại: {product.inStock} sản phẩm</p>
                </div>

                {/* Nút mua */}
                <div className="mt-6 flex gap-4">
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition">
                        Thêm vào giỏ
                    </button>
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition">
                        Mua ngay
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DetailProduct;
