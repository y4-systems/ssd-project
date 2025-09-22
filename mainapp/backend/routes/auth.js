import express from "express";
import rateLimit from "express-rate-limit";
import { register, login } from "./../controlles/authController.js";

const router = express.Router();

// Rate limiter for login/register endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // only 5 attempts per IP per window
  message: { error: "Too many attempts, please try again later." }
});

// Apply limiter only to sensitive routes
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

export default router;
