import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    eventID: {
        type: String,
        required: true
    },
    groomName: {
        type: String,
        required: true
    },
    brideName: {
        type: String,
        required: true
    },
    packages: {
        type: String,
        required: true
    },
    estimatedBudget: {
        type: String,
        required: true
    },
    additionalNotes: {
        type: String,
        required: true
    },
    vendorServices: {
        Venue: {
            type: Boolean,
            default: false
        },
        Catering: {
            type: Boolean,
            default: false
        },
        Photography: {
            type: Boolean,
            default: false
        },
        Outfit: {
            type: Boolean,
            default: false
        },
        Decorations: {
            type: Boolean,
            default: false
        },
        Transport: {
            type: Boolean,
            default: false
        }
    }
});

export default mongoose.model("Budget", budgetSchema);
