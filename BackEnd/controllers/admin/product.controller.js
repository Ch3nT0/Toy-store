const Product = require("../../models/product.model");
const paginationHelper = require("../../helpers/pagination")
const searchHelper = require("../../helpers/search")
const Review = require("../../models/review.model");

// [GET] [ADMIN]/products?page=__&limit=__&keyword=__&&minPrice=__&maxPrice=__
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

// [GET] [ADMIN]/products/:id
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

//[POST] [ADMIN]/products
module.exports.createProduct = async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.json({
        code: 200,
        message: "Tạo sản phẩm thành công",
    })
}

//[PUT] [ADMIN]/products/:id
module.exports.updateProduct = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true }
    );
    if (product) {
        res.json({
            code: 200,
            message: "Cập nhật sản phẩm thành công",
        })
    } else {
        res.json({
            code: 404,
            message: "Không tìm thấy sản phẩm"
        });
    }
}

//[DELETE] [ADMIN]/products/:id
module.exports.deleteProduct = async (req, res) => {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.json({
        code: 200,
        message: "Xóa sản phẩm thành công",
    })
}