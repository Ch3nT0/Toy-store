const User = require("../../models/user.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const { formatNumber } = require("../../helpers/generate");
// [GET] /dashboard
exports.getDashboard = async (req, res) => {
    try {
        const countProduct = await Product.countDocuments();
        const countUser = await User.countDocuments();
        const countOrder = await Order.countDocuments();

        const revenueAgg = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" }
                }
            }
        ]);

        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

        return res.status(200).json({
            data: [
                { title: "Sản phẩm", value: formatNumber(countProduct), color: "bg-blue-500" },
                { title: "Người dùng", value: formatNumber(countUser), color: "bg-green-500" },
                { title: "Đơn hàng", value: formatNumber(countOrder), color: "bg-green-500" },
                { title: "Doanh thu", value: formatNumber(totalRevenue), color: "bg-red-500" },
            ]
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};