import express from "express";
import rateLimit from "express-rate-limit";
import {
  createBooking,
  getAllBooking,
  getBooking
} from "./../controlles/bookingController.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// Rate limiter for bookings (stricter, since these are sensitive operations)
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit to 10 booking requests per IP
  message: { error: "Too many booking attempts, please try again later." }
});

// Create a booking (user action)
router.post("/", verifyUser, bookingLimiter, createBooking);

// Get bookings (user sees their own bookings)
router.get("/", verifyUser, bookingLimiter, getBooking);

// Admin gets all bookings
router.get("/all", verifyAdmin, bookingLimiter, getAllBooking);

export default router;
