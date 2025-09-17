const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema(
  {
    subName: {
      type: String,
      required: true,
    },
    subCode: {
      type: String,
      required: true,
    },
    sessions: {
      type: String,
      required: true,
    },
    stableName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "stable",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendor",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("preference", preferenceSchema);
