const mongoose = require("mongoose");
const Booking = require("../models/bookingSchema.js");

// ---------------- NEW BOOKING ----------------
const newBooking = async (req, res) => {
  try {
    const {
      buyer,
      shippingData,
      bookingedServices,
      paymentInfo,
      servicesQuantity,
      totalPrice
    } = req.body;

    // Validate user input before saving
    if (!mongoose.Types.ObjectId.isValid(buyer)) {
      return res.status(400).json({ error: "Invalid buyer ID" });
    }

    const booking = await Booking.create({
      buyer,
      shippingData,
      bookingedServices, // should be validated separately if nested schema allows
      paymentInfo,
      paidAt: Date.now(),
      servicesQuantity,
      totalPrice
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

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid couple ID" });
    }

    const bookings = await Booking.find({
      buyer: new mongoose.Types.ObjectId(id)
    });

    if (bookings.length > 0) {
      const bookingedServices = bookings.reduce((acc, booking) => {
        acc.push(...booking.bookingedServices);
        return acc;
      }, []);
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

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid vendor ID" });
    }

    const bookingsWithVendorId = await Booking.find({
      "bookingedServices.vendor": new mongoose.Types.ObjectId(id)
    });

    if (bookingsWithVendorId.length > 0) {
      const bookingedServices = bookingsWithVendorId.reduce((acc, booking) => {
        booking.bookingedServices.forEach((service) => {
          const existingIndex = acc.findIndex(
            (p) => p._id.toString() === service._id.toString()
          );
          if (existingIndex !== -1) {
            acc[existingIndex].quantity += service.quantity;
          } else {
            acc.push(service);
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
