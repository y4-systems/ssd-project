const Booking = require('../models/bookingSchema.js');

const newBooking = async (req, res) => {
    try {

        const {
            buyer,
            shippingData,
            bookingedServices,
            paymentInfo,
            servicesQuantity,
            totalPrice,
        } = req.body;

        const booking = await Booking.create({
            buyer,
            shippingData,
            bookingedServices,
            paymentInfo,
            paidAt: Date.now(),
            servicesQuantity,
            totalPrice,
        });

        return res.send(booking);

    } catch (err) {
        res.status(500).json(err);
    }
}

const getBookingedServicesByCouple = async (req, res) => {
    try {
        let bookings = await Booking.find({ buyer: req.params.id });

        if (bookings.length > 0) {
            const bookingedServices = bookings.reduce((accumulator, booking) => {
                accumulator.push(...booking.bookingedServices);
                return accumulator;
            }, []);
            res.send(bookingedServices);
        } else {
            res.send({ message: "No services found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getBookingedServicesByVendor = async (req, res) => {
    try {
        const vendorId = req.params.id;

        const bookingsWithVendorId = await Booking.find({
            'bookingedServices.vendor': vendorId
        });

        if (bookingsWithVendorId.length > 0) {
            const bookingedServices = bookingsWithVendorId.reduce((accumulator, booking) => {
                booking.bookingedServices.forEach(service => {
                    const existingServiceIndex = accumulator.findIndex(p => p._id.toString() === service._id.toString());
                    if (existingServiceIndex !== -1) {
                        // If service already exists, merge quantities
                        accumulator[existingServiceIndex].quantity += service.quantity;
                    } else {
                        // If service doesn't exist, add it to accumulator
                        accumulator.push(service);
                    }
                });
                return accumulator;
            }, []);
            res.send(bookingedServices);
        } else {
            res.send({ message: "No services found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    newBooking,
    getBookingedServicesByCouple,
    getBookingedServicesByVendor
};
