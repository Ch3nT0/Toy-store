const Product = require("../../models/product.model");
const paginationHelper = require("../../helpers/pagination")
const searchHelper = require("../../helpers/search")
const Review = require("../../models/review.model");

// [GET] /products?page=__&limit=__&keyword=__&&minPrice=__&maxPrice=__
module.exports.getProducts = async (req, res) => {
    const query = req.query;
    const search = searchHelper(req.query);
    const count = await Product.countDocuments();
    const paging = paginationHelper({ currentPage: 1, limitItem: 10 }, query, count);
    const product = await Product.find(search)
        .select("name price discount images rating reviewCount")
        .skip(paging.skip)
        .limit(paging.limitItem);
    res.json({
        code: 200,
        message: "Thành công",
        currentPage: paging.currentPage,
        totalPage: paging.totalPage,
        data: product
    });
};

// [GET] /products/TopSale
module.exports.getProductsTopSale = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ sold: -1 })
            .limit(5)
            .select("name price discount images rating reviewCount sold");

        res.json({
            code: 200,
            message: "Thành công",
            data: products
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            message: "Lỗi server"
        });
    }
};

// [GET] /products/TopDiscount
module.exports.getProductsTopDiscount = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ discount: -1 })
            .limit(5)
            .select("name price discount images rating reviewCount discount");

        res.json({
            code: 200,
            message: "Thành công",
            data: products
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            code: 500,
            message: "Lỗi server"
        });
    }
};


// [GET] /products/:id
module.exports.getProductByID = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id });
    if (product) {
        const reviews = await Review.find({ productId: id }).select("userId rating comment createdAt");
        res.json({
            code: 200,
            message: "Thành công",
            data: {
                ...product.toObject(),
                reviews: reviews
            }
        });
    } else {
        res.json({
            code: 404,
            message: "Không tìm thấy sản phẩm"
        });
    }
};