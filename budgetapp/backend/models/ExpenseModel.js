import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is Required"],
        trim: true,
        maxLength: 50
    },
    amount: {
        type: Number,
        required: [true, "Amount is Required"],
        trim: true,
        maxLength: 20
    },
    type: {
        type: String,
        default: "Expense"
    },
    date: {
        type: Date,
        required: [true, "Date is Required"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Category is Required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is Required"],
        trim: true,
        maxLength: 20
    }
}, { timestamps: true });

export default mongoose.model("Expense", expenseSchema);
