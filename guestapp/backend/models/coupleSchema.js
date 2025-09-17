const mongoose = require("mongoose")

const coupleSchema = new mongoose.Schema({
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
        default: "Couple"
    }
}, { timestamps: true });

module.exports = mongoose.model("couple", coupleSchema)