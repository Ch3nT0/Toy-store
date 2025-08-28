const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        phone: String,
        role: {
            type: String,
            default: "admin",
            enum: [
                "admin",
                "product_manager",
                "account_manager",
                "support_staff"
            ]
        }
    }, {
    timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema, "admins");

module.exports = Admin;
