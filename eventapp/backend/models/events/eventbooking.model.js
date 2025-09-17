const mongoose = require("mongoose");

const eventbookingSchema = new mongoose.Schema(
  {
    occasion: { type: mongoose.Schema.Types.ObjectID, ref: "occasions" },
    user: { type: mongoose.Schema.Types.ObjectID, ref: "users" },
    bookedTimeSlots: { from: { type: String }, to: { type: String } },
    totalHours: { type: Number },
    totalAmount: { type: Number },
    driverRequired: { type: Boolean },
    eventbookingStatus: { type: String, default: "Pending" },
  },
  { timestamps: true, versionKey: false }
);

const eventbookingModel = mongoose.model("eventbookings", eventbookingSchema);
module.exports = eventbookingModel;
