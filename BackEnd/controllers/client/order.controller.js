const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const Cart = require("../../models/cart.model")

//[GET] /order
exports.getOrdersByUser = async (req, res) => {
    try{
        const userId = req.user._id;
        const orders = await Order.find({ userId: userId });
        if(!orders){
            return res.status(404).json({ message: "No orders found" });
        }
        res.json({
            code:200,
            message: "Orders retrieved successfully",
            data: orders
        });
    }catch{
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

// [POST] order/product/:id
module.exports.orderProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user._id;
        const {  fullName, address, phone, size, color, quantity, paymentMethod, discountAll } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        const discount = product.discount || 0;
        const price = product.price;
        const totalPriceProduct = (price - discount) * quantity;

        const newOrder = new Order({
            userId: userId,
            client: {
                fullName,
                address,
                phone
            },
            products: [
                {
                    productId: productId,
                    size,
                    color,
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
        const { cartId, fullName, address, phone, dicount, paymentMethod } = req.body;

        const cart = await Cart.findOne({ _id: cartId }).select("userId products");
        if (!cart) {
            return res.status(400).json({
                message: 'Không tìm thấy giỏ hàng',
            });
        }

        const { userId, products } = cart;

        let totalPriceProduct = 0;

        const updatedProducts = await Promise.all(products.map(async (item) => {
            const product = await Product.findById(item.productId).select("price discount");
            if (!product) {
                throw new Error(`Sản phẩm với ID ${item.productId} không tồn tại`);
            }

            const price = product.price;
            const discount = product.discount || 0;
            const finalPrice = price * (1 - discount / 100);
            const itemTotal = finalPrice * item.quantity;

            totalPriceProduct += itemTotal;

            return {
                ...item.toObject(),
                price,
                discount
            };
        }));

        const newOrder = new Order({
            userId: userId,
            client: {
                fullName,
                address,
                phone
            },
            products: updatedProducts,
            discount: dicount || 0,
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
        res.status(400).json({
            message: error.message || 'Có lỗi xảy ra khi đặt hàng'
        });
    }
};

