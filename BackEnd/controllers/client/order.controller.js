const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const Cart = require("../../models/cart.model")
const sendMailHelper = require("../../helpers/sendMail");

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
        const { client, product, paymentMethod, quantity } = req.body;
        const existingProduct = await Product.findById(product._id);

        if (!existingProduct) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại trong kho." });
        }
        const requestedQuantity = parseInt(quantity);
        if (requestedQuantity <= 0 || requestedQuantity > existingProduct.inStock) {
            return res.status(400).json({ 
                message: `Số lượng đặt hàng không hợp lệ. Chỉ còn **${existingProduct.inStock}** sản phẩm.` 
            });
        }

        const discountAll = 0;
        const discount = existingProduct.discount || 0;
        const price = existingProduct.price;
        
        const totalPriceProduct = (price - discount) * requestedQuantity;

        const newOrder = new Order({
            userId: userId,
            client: client,
            products: [
                {
                    productId: existingProduct._id,
                    quantity: requestedQuantity,
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

        await Product.findByIdAndUpdate(
            existingProduct._id,
            { $inc: { inStock: -requestedQuantity } }, 
            { new: true } 
        );
        await newOrder.save();
        
        const subject = "Đặt hàng thành công";
        const html = `Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là: <b>${newOrder._id}</b>. Tổng tiền: <b>${totalPriceProduct.toFixed(2)} VND</b>.`;
        sendMailHelper.senMail(req.user.email, subject, html);
        
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
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                message: 'Giỏ hàng trống hoặc không tồn tại.',
            });
        }

        const { products } = cart;
        let totalPriceProduct = 0;
        const stockUpdates = [];
        
        const updatedProducts = await Promise.all(
            products.map(async (item) => {
                const existingProduct = await Product.findById(item.productId).select("price discount inStock");
                
                if (!existingProduct) {
                    throw new Error(`Sản phẩm (ID: ${item.productId}) không tồn tại trong kho.`);
                }
                
                const requestedQuantity = parseInt(item.quantity);
                                if (requestedQuantity <= 0 || requestedQuantity > existingProduct.inStock) {
                    throw new Error(`Sản phẩm "${existingProduct.name || existingProduct._id}" chỉ còn **${existingProduct.inStock}** sản phẩm. Đặt hàng thất bại.`);
                }
                
                stockUpdates.push({
                    productId: existingProduct._id,
                    quantityToSubtract: requestedQuantity
                });

                const price = existingProduct.price;
                const discountValue = existingProduct.discount || 0;
                
                const finalPrice = price * (1 - discountValue / 100); 
                const itemTotal = finalPrice * requestedQuantity;

                totalPriceProduct += itemTotal;

                return {
                    productId: existingProduct._id, 
                    quantity: requestedQuantity,
                    price,
                    discount: discountValue,
                    totalPrice: itemTotal
                };
            })
        );

        await Promise.all(stockUpdates.map(async (update) => {
             await Product.findByIdAndUpdate(
                update.productId,
                { $inc: { inStock: -update.quantityToSubtract } } // Giảm inStock
            );
        }));

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
        
        const subject = "Đặt hàng thành công";
        const html = `Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là: <b>${newOrder._id}</b>. Tổng tiền: <b>${finalOrderTotal.toFixed(2)} VND</b>.`;
        sendMailHelper.senMail(req.user.email, subject, html);
        
        res.status(201).json({
            message: "Đặt hàng thành công",
            orderId: newOrder._id,
            order: newOrder
        });
        
    } catch (error) {
        console.error("Lỗi đặt hàng từ giỏ:", error);
        res.status(500).json({
            message: error.message || 'Có lỗi xảy ra khi đặt hàng'
        });
    }
};

// [PUT] /order/:id/
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const newStatus = req.body.status;
        const currentOrder = await Order.findById(id);

        if (!currentOrder) {
            return res.status(404).json({
                code: 404,
                message: "Không tìm thấy đơn hàng"
            });
        }
        
        const oldStatus = currentOrder.status;
        const updateData = { status: newStatus };

        if (oldStatus !== 'cancelled' && newStatus === 'cancelled') {
            const stockRestorationPromises = currentOrder.products.map(productItem => {
                const quantityToRestore = productItem.quantity;
                return Product.findByIdAndUpdate(
                    productItem.productId,
                    { $inc: { inStock: quantityToRestore } } 
                );
            });
            
            await Promise.all(stockRestorationPromises);
            console.log(`Khôi phục tồn kho thành công cho đơn hàng ID: ${id}`);
        }
        delete updateData.paidAt;

        if (newStatus === 'completed' && !currentOrder.paidAt) { 
             updateData.paidAt = new Date();
        }
        const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });

        res.json({
            code: 200,
            message: "Cập nhật trạng thái đơn hàng thành công",
            data: updatedOrder
        });
        
    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({
            code: 500,
            message: "Lỗi server khi cập nhật trạng thái đơn hàng"
        });
    }
};