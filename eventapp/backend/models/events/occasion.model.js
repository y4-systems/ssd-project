const mongoose = require("mongoose");

const occasionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    capacity: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    bookedTimeSlots: [
      {
        from: { type: String, required: true },
        to: { type: String, required: true },
      },
    ],
    rentPerHour: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);
const occasionModel = mongoose.model("occasions", occasionSchema);
module.exports = occasionModel;
