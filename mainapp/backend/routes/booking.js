import express from "express";
import rateLimit from "express-rate-limit";
import {
  createBooking,
  getAllBooking,
  getBooking
} from "./../controlles/bookingController.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// Booking limiter (strict - protects writes)
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // allow max 10 requests per IP
  message: { error: "Too many booking attempts, please try again later." }
});

// Public GET limiter (for read-only database operations)
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." }
});

// ===== Routes =====

// Create a booking (rate limit first → then verify → then controller)
router.post("/", bookingLimiter, verifyUser, createBooking);

// Get bookings (user's own bookings)
router.get("/", readLimiter, verifyUser, getBooking);

// Get all bookings (admin only)
router.get("/all", readLimiter, verifyAdmin, getAllBooking);

export default router;
