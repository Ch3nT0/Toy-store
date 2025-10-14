const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    brand: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    inStock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    images: String,
    model3D: String,
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product;
