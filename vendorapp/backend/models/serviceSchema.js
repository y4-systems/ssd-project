const mongoose = require("mongoose")

const serviceSchema = new mongoose.Schema(
    {
        serviceName: {
            type: String
        },
        price: {
            mrp: {
                type: Number
            },
            cost: {
                type: Number
            },
            discountPercent: {
                type: Number
            }
        },
        subcategory: {
            type: String
        },
        serviceImage: {
            type: String
        },
        category: {
            type: String
        },
        description: {
            type: String
        },
        tagline: {
            type: String
        },
        quantity: {
            type: Number,
            default: 1
        },
        reviews: [
            {
                rating: {
                    type: Number,
                },
                comment: {
                    type: String,
                },
                reviewer: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "couple",
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'vendor'
        },
    }, { timestamps: true });

module.exports = mongoose.model("service", serviceSchema)