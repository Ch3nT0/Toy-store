const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const Cart = require("../../models/cart.model")

//[GET] /order/user/:id
exports.getOrdersByUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const orders = await Order.find({ userId: userId });
        if (!orders) {
            return res.status(404).json({ message: "No orders found" });
        }
        res.json({
            code: 200,
            message: "Orders retrieved successfully",
            data: orders
        });
    } catch {
        res.json({
            code: 500,
            message: "Error retrieving orders",
        })
    }

}

//[GET] order/:id
exports.getOrderByID = async (req, res) => {

    try {
        const id = req.params.id;
        const order = await Order.findOne({ _id: id });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        } else {
            return res.status(200).json(order);
        }
    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

//[DELETE] order/:id
exports.deleteOrderByID = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        } else {
            await Order.findByIdAndDelete(id);
            return res.status(200).json({ message: "Xoá đơn hàng thành công" });
        }
    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// [GET] /order?status=
exports.getOrders = async (req, res) => {
    try {
        const { status } = req.query;
        const orders = await Order.find({status: status});
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.json({
            code: 200,
            message: "Orders retrieved successfully",
            data: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: "Error retrieving orders",
        });
    }
};

// [GET] /order/revenue/6-months
exports.getRevenueLast6Months = async (req, res) => {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        const revenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    totalRevenue: { $sum: "$totalPrice" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        const formatted = revenue.map(r => ({
            year: r._id.year,
            month: r._id.month,
            totalRevenue: r.totalRevenue
        }));

        res.json({
            code: 200,
            message: "Revenue last 6 months retrieved successfully",
            data: formatted
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            code: 500,
            message: "Error retrieving revenue",
        });
    }
};

// [PUT] /order/:id/status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Kiểm tra status hợp lệ
        const validStatuses = ["pending", "processing", "shipping", "delivered", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                code: 400,
                message: "Trạng thái không hợp lệ"
            });
        }
        // Tạo object cập nhật
        const updateData = { status };
        if (status === "delivered") updateData.deliveredAt = new Date();
        if (status === "completed") updateData.paidAt = new Date();

        const order = await Order.findByIdAndUpdate(id, updateData, { new: true });

        if (!order) {
            return res.status(404).json({
                code: 404,
                message: "Không tìm thấy đơn hàng"
            });
        }

        res.json({
            code: 200,
            message: "Cập nhật trạng thái đơn hàng thành công",
            data: order
        });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({
            code: 500,
            message: "Lỗi khi cập nhật trạng thái đơn hàng"
        });
    }
};
