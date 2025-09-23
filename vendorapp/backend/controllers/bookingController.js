const mongoose = require("mongoose");
const Booking = require("../models/bookingSchema.js");
const Joi = require("joi");

// ---------------- Validation Schema ----------------
const bookingSchema = Joi.object({
  buyer: Joi.string().required(),
  shippingData: Joi.object().default({}),
  bookingedServices: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().required(),
        vendor: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        serviceName: Joi.string().allow("").optional()
      })
    )
    .min(1)
    .required(),
  paymentInfo: Joi.object().default({}),
  servicesQuantity: Joi.number().min(0).required(),
  totalPrice: Joi.number().min(0).required()
});

// ---------------- NEW BOOKING ----------------
const newBooking = async (req, res) => {
  try {
    // ✅ Validate input with Joi
    const { value, error } = bookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // ✅ Safe booking creation (sanitized fields only)
    const booking = await Booking.create({
      buyer: new mongoose.Types.ObjectId(value.buyer),
      shippingData: value.shippingData,
      bookingedServices: value.bookingedServices.map((s) => ({
        _id: new mongoose.Types.ObjectId(s._id),
        vendor: new mongoose.Types.ObjectId(s.vendor),
        quantity: s.quantity,
        serviceName: s.serviceName?.trim() || "Unnamed Service"
      })),
      paymentInfo: value.paymentInfo,
      paidAt: Date.now(),
      servicesQuantity: value.servicesQuantity,
      totalPrice: value.totalPrice
    });

    return res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- GET BOOKINGS BY COUPLE ----------------
const getBookingedServicesByCouple = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid couple ID" });
    }

    const bookings = await Booking.find({
      buyer: new mongoose.Types.ObjectId(id)
    });

    if (bookings.length > 0) {
      const bookingedServices = bookings.flatMap(
        (booking) => booking.bookingedServices
      );
      return res.json(bookingedServices);
    }

    res.json({ message: "No services found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- GET BOOKINGS BY VENDOR ----------------
const getBookingedServicesByVendor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid vendor ID" });
    }

    const bookingsWithVendorId = await Booking.find({
      "bookingedServices.vendor": new mongoose.Types.ObjectId(id)
    });

    if (bookingsWithVendorId.length > 0) {
      const bookingedServices = bookingsWithVendorId.reduce((acc, booking) => {
        booking.bookingedServices.forEach((service) => {
          if (service.vendor.toString() === id.toString()) {
            const existingIndex = acc.findIndex(
              (p) => p._id.toString() === service._id.toString()
            );
            if (existingIndex !== -1) {
              acc[existingIndex].quantity += service.quantity;
            } else {
              acc.push({
                _id: service._id,
                vendor: service.vendor,
                quantity: service.quantity,
                serviceName: service.serviceName
              });
            }
          }
        });
        return acc;
      }, []);

      return res.json(bookingedServices);
    }

    res.json({ message: "No services found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  newBooking,
  getBookingedServicesByCouple,
  getBookingedServicesByVendor
};
