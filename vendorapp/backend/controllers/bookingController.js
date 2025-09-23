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

    // ✅ Validate buyer ID
    if (!mongoose.Types.ObjectId.isValid(buyer)) {
      return res.status(400).json({ error: "Invalid buyer ID" });
    }

    // ✅ Validate bookingedServices
    if (!Array.isArray(bookingedServices) || bookingedServices.length === 0) {
      return res
        .status(400)
        .json({ error: "Booked services must be a non-empty array" });
    }

    for (const service of bookingedServices) {
      if (
        !mongoose.Types.ObjectId.isValid(service._id) ||
        !mongoose.Types.ObjectId.isValid(service.vendor) ||
        typeof service.quantity !== "number" ||
        service.quantity <= 0
      ) {
        return res.status(400).json({ error: "Invalid service details" });
      }
    }

    // ✅ Safe booking creation (no raw user injection)
    const booking = await Booking.create({
      buyer: new mongoose.Types.ObjectId(buyer),
      shippingData: shippingData || {},
      bookingedServices: bookingedServices.map((s) => ({
        _id: new mongoose.Types.ObjectId(s._id),
        vendor: new mongoose.Types.ObjectId(s.vendor),
        quantity: s.quantity,
        serviceName: s.serviceName?.toString().trim() || "Unnamed Service"
      })),
      paymentInfo: paymentInfo || {},
      paidAt: Date.now(),
      servicesQuantity: Number(servicesQuantity) || 0,
      totalPrice: Number(totalPrice) || 0
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
