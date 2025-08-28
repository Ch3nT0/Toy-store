const Cart = require("../../models/cart.model");

// [GET] /cart
module.exports.getCart = async (req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId: userId })
        .populate("products.productId", "name price images discount");

    res.json({
        code: 200,
        products: cart ? cart.products : []
    });
};

// [PATCH] /cart/increase/:productId
module.exports.increaseQuantity = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ code: 404, message: "Cart not found" });

    const item = cart.products.find(p => p.productId.toString() === productId);
    if (item) {
        item.quantity += 1;
        await cart.save();
    }

    await cart.populate("products.productId", "name price images discount");

    res.json({ code: 200, products: cart.products });
};

// [PATCH] /cart/decrease/:productId
module.exports.decreaseQuantity = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ code: 404, message: "Cart not found" });

    const item = cart.products.find(p => p.productId.toString() === productId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        await cart.save();
    }


    await cart.populate("products.productId", "name price images discount");

    res.json({ code: 200, products: cart.products });
};



// [PUT] /cart
module.exports.updateCart = async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
        cart = new Cart({
            userId,
            products: [{ productId, quantity }]
        });
    } else {
        const existingProduct = cart.products.find(
            p => p.productId.toString() === productId
        );
        if (existingProduct) {
            existingProduct.quantity += quantity;
            if (existingProduct.quantity <= 0) {
                cart.products = cart.products.filter(
                    p => p.productId.toString() !== productId
                );
            }
        } else {
            if (quantity > 0) {
                cart.products.push({ productId, quantity });
            }
        }
    }

    await cart.save();
    res.json({
        code: 200,
        message: "Đã cập nhật giỏ hàng"
    });
};

// [DELETE] /cart/:productId
module.exports.deleteFromCart = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId: userId });
    if (!cart) {
        return res.status(404).json({
            code: 404,
            message: "Giỏ hàng không tồn tại"
        });
    }

    const beforeCount = cart.products.length;
    cart.products = cart.products.filter(
        p => p.productId.toString() !== productId
    );

    if (beforeCount === cart.products.length) {
        return res.status(404).json({
            code: 404,
            message: "Sản phẩm không có trong giỏ"
        });
    }

    await cart.save();

    res.json({
        code: 200,
        message: "Đã xoá sản phẩm khỏi giỏ hàng"
    });
};
