const mongoose = require("mongoose");

const stableSchema = new mongoose.Schema({
    stableName: {
        type: String,
        required: true,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
}, { timestamps: true });

module.exports = mongoose.model("stable", stableSchema);

