const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const Review = require("../../models/review.model");

// [POST] /review/order/product
module.exports.postReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body;
        userId = req.user._id;
        const { id } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                code: 404,
                message: "Product not found"
            });
        }
        const order = await Order.findOne({
            userId,
            "products.productId": productId
        });

        if (!order) {
            return res.status(403).json({ code: 403, message: "Bạn chưa mua sản phẩm này" });
        }
        const review = new Review({
            userId,
            productId,
            rating,
            comment
        })
        const result = await review.save();
        res.json({
            code: 200,
            message: "Đánh giá sản phẩm thành công",
        });
    } catch {
        res.status(500).json({
            code: 500,
            message: "Lỗi hệ thống"
        });
    }
};

// [PUT] /review/:id
module.exports.editReview = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findOne({ _id: id, userId });

        if (!review) {
            return res.status(404).json({ code: 404, message: "Không tìm thấy đánh giá của bạn" });
        }

        review.rating = rating ?? review.rating;
        review.comment = comment ?? review.comment;
        await review.save();

        res.json({ code: 200, message: "Cập nhật đánh giá thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi hệ thống" });
    }
};

// [DELETE] /review/:id
module.exports.deleteReview = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const review = await Review.findOneAndDelete({ _id:id ,userId: userId });
        if (!review) {
            return res.status(404).json({ code: 404, message: "Không tìm thấy đánh giá của bạn" });
        }

        res.json({ code: 200, message: "Xóa đánh giá thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi hệ thống" });
    }
};