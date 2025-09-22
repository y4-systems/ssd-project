import express from "express";
import rateLimit from "express-rate-limit";
import {
  createBooking,
  getAllBooking,
  getBooking
} from "./../controlles/bookingController.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// Booking limiter (strict)
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many booking attempts, please try again later." }
});

// Public GET limiter (for database reads)
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." }
});

// Routes
router.post("/", verifyUser, bookingLimiter, createBooking);
router.get("/", verifyUser, readLimiter, getBooking); // user’s own bookings
router.get("/all", verifyAdmin, readLimiter, getAllBooking); // admin all bookings

export default router;
