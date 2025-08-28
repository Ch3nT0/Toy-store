const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: String,
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                min: 1,
            }
        },
    ]
}, {
    timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema, "carts");

module.exports = Cart;