const mongoose = require("mongoose")

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Vendor"
    },
    shopName: {
        type: String,
        unique: true,
        required: true
    }
});

module.exports = mongoose.model("vendor", vendorSchema)