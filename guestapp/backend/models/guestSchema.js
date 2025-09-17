const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNum: {
    type: Number,
    required: true,
  },
  password: {
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
    required: true,
  },
  role: {
    type: String,
    default: "Guest",
  },
  examResult: [
    {
      subName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "preference",
      },
      obligesObtained: {
        type: Number,
        default: 0,
      },
    },
  ],
  attendance: [
    {
      date: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["Present", "Absent"],
        required: true,
      },
      subName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "preference",
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("guest", guestSchema);
