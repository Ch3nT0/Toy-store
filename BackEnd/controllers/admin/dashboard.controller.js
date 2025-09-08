const User = require("../../models/user.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
//[GET] dashboard
exports.getDashboard = async (req, res) => {
    try {
        const id = req.params.id;
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
                { title: "Sản phẩm", value: countProduct, color: "bg-blue-500" },
                { title: "Người dùng", value: countUser, color: "bg-green-500" },
                { title: "Đơn hàng", value: countOrder, color: "bg-yellow-500" },
                { title: "Doanh thu", value: totalRevenue, color: "bg-red-500" },
            ]
        });
    } catch {
        return res.status(500).json(
            { message: "Internal Server Error" }
        );
    }
}