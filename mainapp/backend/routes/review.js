import express from "express";
import rateLimit from "express-rate-limit";
import { createReview } from "./../controlles/reviewController.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// Rate limiter for review creation (max 10 requests per 15 minutes per IP)
const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many review attempts, please try again later." }
});

router.post("/:tourId", verifyUser, reviewLimiter, createReview);

export default router;
