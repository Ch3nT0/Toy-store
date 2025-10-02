const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: String,
    client: {
        fullName: String,
        address: String,
        phone: String,
    },
    products: [
        {
            _id: false,
            productId: String,
            quantity: {
                type: Number,
                min: 1,
            },
            price: Number,
            discount: {
                type: Number,
                default: 0
            },
            totalPrice: Number,
        },
    ],
    discount: { type: Number, default: 0 },
    totalPrice: {
        type: Number
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'Paypal', 'Momo'],
        default: 'COD'
    },
    paidAt: Date,
    deliveredAt: Date,
    status: {
        type: String,
        enum: ['pending', 'processing', 'delivered', 'cancelled', 'shipping','completed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
