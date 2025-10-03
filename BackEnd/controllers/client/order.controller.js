const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const Cart = require("../../models/cart.model")

//[GET] /order
exports.getOrdersByUser = async (req, res) => {
    try {
        const userId = req.user._id;
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
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        } else {
            return res.status(200).json(order);
        }
    } catch {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// [POST] order
module.exports.orderProduct = async (req, res) => {
    try {
        const userId = req.user._id;
        const { client,product,paymentMethod,quantity } = req.body;
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }
        const discountAll = 0; 
        const discount = product.discount || 0;
        const price = product.price;
        const totalPriceProduct = (price - discount) * quantity;

        const newOrder = new Order({
            userId: userId,
            client: client,
            products: [
                {
                    productId: product._id,
                    quantity,
                    price,
                    discount,
                    totalPrice: totalPriceProduct
                }
            ],
            discount: discountAll,
            totalPrice: totalPriceProduct,
            paymentMethod,
            status: "pending"
        });

        await newOrder.save();

        res.status(201).json({
            message: "Đặt hàng thành công",
            orderId: newOrder._id,
            order: newOrder
        });
    } catch (error) {
        console.error("Lỗi đặt hàng:", error);
        res.status(500).json({ message: "Lỗi server khi đặt hàng" });
    }
};

//[POST] /order/cart
module.exports.orderCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName, address, phone, discount, paymentMethod } = req.body;

        // Tìm cart theo userId
        const cart = await Cart.findOne({ userId }).select("userId products");
        if (!cart) {
            return res.status(400).json({
                message: 'Không tìm thấy giỏ hàng',
            });
        }

        const { products } = cart;
        let totalPriceProduct = 0;

        // Cập nhật thông tin từng sản phẩm
        const updatedProducts = await Promise.all(
            products.map(async (item) => {
                const product = await Product.findById(item.productId).select("price discount");
                if (!product) {
                    throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
                }

                const price = product.price;
                const discountValue = product.discount || 0;
                const finalPrice = price * (1 - discountValue / 100);
                const itemTotal = finalPrice * item.quantity;

                totalPriceProduct += itemTotal;

                return {
                    ...item.toObject(),
                    price,
                    discount: discountValue,
                    totalPrice: itemTotal  
                };
            })
        );

        // Áp dụng thêm discount toàn đơn (nếu có)
        const finalOrderTotal = totalPriceProduct * (1 - (discount || 0) / 100);

        const newOrder = new Order({
            userId: userId,
            client: {
                fullName,
                address,
                phone
            },
            products: updatedProducts,
            discount: discount || 0,
            totalPrice: finalOrderTotal,  
            paymentMethod,
            status: "pending"
        });


        await newOrder.save();
        await Cart.deleteOne({ userId });
        res.json({
            message: "Đặt hàng thành công",
            orderId: newOrder._id,
            order: newOrder
        });
    } catch (error) {
        res.json({
            message: 'Có lỗi xảy ra khi đặt hàng'
        });
    }
};

// [PUT] /order/:id/
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const status = "completed";
        // Tạo object cập nhật
        const updateData = { status };
        updateData.paidAt = new Date();

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
