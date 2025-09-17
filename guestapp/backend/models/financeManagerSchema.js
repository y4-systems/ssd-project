const mongoose = require("mongoose");

const financeManagerSchema = new mongoose.Schema(
  {
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
      default: "FinanceManager",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("financeManager", financeManagerSchema);
