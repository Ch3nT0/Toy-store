const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
{
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
},{
    timestamps: true
});

const Client = mongoose.model('Client', clientSchema, "clients");

module.exports = Client;
