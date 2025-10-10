import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import { getThumb } from "../../../services/client/aboutService";
import { getProductTopDiscount, getProductTopSale } from "../../../services/client/productService";
import { useNavigate } from "react-router-dom";
import { updateCart } from "../../../services/client/cartService";


function Home() {
    const navigate = useNavigate();
    const [thumb, setThumb] = React.useState([]);
    const [topSaleProducts, setTopSaleProducts] = React.useState([]);
    const [topHotProducts, setTopHotProducts] = React.useState([]);
    const [thumbsSwiper] = React.useState(null);


    const handleAddCart = async (IdProduct) => {
        try {
            const res = await updateCart(IdProduct, 1);
            alert(res.message);
        } catch (error) {
            console.error("Add cart error:", error);
        }
    };

    // Lấy thumb
    useEffect(() => {
        const fetchThumb = async () => {
            const data = await getThumb();
            setThumb(data);
        };
        fetchThumb();
    }, []);

    // Lấy top sản phẩm sale
    useEffect(() => {
        const fetchTopSale = async () => {
            const data = await getProductTopDiscount();
            setTopSaleProducts(data.data);
        };
        fetchTopSale();
    }, []);

    // Lấy top sản phẩm bán chạy
    useEffect(() => {
        const fetchTopHot = async () => {
            const data = await getProductTopSale();
            setTopHotProducts(data.data);
        };
        fetchTopHot();
    }, []);

    return (
        <div className="space-y-12">
            {/* Slider */}
            <div className="max-w-6xl mx-auto ">
                <Swiper
                    modules={[Navigation, Pagination, Thumbs, Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
                    thumbs={{ swiper: thumbsSwiper }}
                    loop
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    className="rounded-xl overflow-hidden shadow-lg"
                >
                    {thumb.map((src, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={src}
                                alt={`Slide ${index}`}
                                className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover object-center transition-transform duration-500 hover:scale-105"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>



            {/* Top sale products */}
            <section className="max-w-6xl mx-auto mb-10">
                <h2 className="text-2xl font-semibold mb-4">Top sản phẩm sale</h2>

                <div className="relative px-10">
                    {/* Nút trái */}
                    <button
                        onClick={() =>
                            document.getElementById("topSaleContainer").scrollBy({ left: -300, behavior: "smooth" })
                        }
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
                    >
                        ◀
                    </button>

                    {/* Danh sách sản phẩm ngang */}
                    <div
                        id="topSaleContainer"
                        className="flex gap-6 overflow-hidden scroll-smooth"
                    >
                        {topSaleProducts.map((product) => (
                            <div
                                key={product._id}
                                onClick={() => navigate(`/product/${product._id}`)} 
                                className="min-w-[250px] bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                {/* Ảnh sản phẩm */}
                                <div className="relative w-full overflow-hidden">
                                    <img
                                        src={product.images}
                                        alt={product.name}
                                        className="w-full h-48 object-cover rounded-t-2xl transition-transform duration-500 hover:scale-105"
                                    />
                                    {product.discount > 0 && (
                                        <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                                            -{product.discount}%
                                        </span>
                                    )}
                                </div>

                                {/* Thông tin sản phẩm */}
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
                                                navigate(`/product/payment/${product._id}`);
                                            }}
                                        >
                                            Mua ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Nút phải */}
                    <button
                        onClick={() =>
                            document.getElementById("topSaleContainer").scrollBy({ left: 300, behavior: "smooth" })
                        }
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
                    >
                        ▶
                    </button>
                </div>
            </section>



            {/* Top hot products */}
            <section className="max-w-6xl mx-auto mb-10">
                <h2 className="text-2xl font-semibold mb-4">Top sản phẩm bán chạy</h2>

                <div className="relative px-10">
                    {/* Nút trái */}
                    <button
                        onClick={() =>
                            document.getElementById("hotProductsContainer").scrollBy({ left: -300, behavior: "smooth" })
                        }
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
                    >
                        ◀
                    </button>

                    {/* Danh sách sản phẩm ngang */}
                    <div
                        id="hotProductsContainer"
                        className="flex gap-6 overflow-hidden scroll-smooth"
                    >
                        {topHotProducts.map((product) => (
                            <div
                                key={product._id}
                                onClick={() => navigate(`/product/${product._id}`)} 
                                className="min-w-[250px] bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                {/* Ảnh sản phẩm */}
                                <div className="relative w-full overflow-hidden">
                                    <img
                                        src={product.images}
                                        alt={product.name}
                                        className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-t-2xl transition-transform duration-500 hover:scale-105"
                                    />
                                    {product.discount > 0 && (
                                        <span className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                                            -{product.discount}%
                                        </span>
                                    )}
                                </div>

                                {/* Thông tin sản phẩm */}
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
                                            <span className="text-blue-600 font-extrabold text-lg">
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
                                                navigate(`/product/payment/${product._id}`);
                                            }}
                                        >
                                            Mua ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Nút phải */}
                    <button
                        onClick={() =>
                            document.getElementById("hotProductsContainer").scrollBy({ left: 300, behavior: "smooth" })
                        }
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
                    >
                        ▶
                    </button>
                </div>
            </section>



        </div>
    );
}

export default Home;
