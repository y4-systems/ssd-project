import express from "express";
import rateLimit from "express-rate-limit";
import {
  createTour,
  updateTour,
  deleteTour,
  getSingleTour,
  getAllTour,
  getTourBysearch,
  getFeaturedTour,
  getTourCount
} from "./../controlles/tourController.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// Admin limiter (strict)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many admin requests, please try again later." }
});

// Public GET limiter (generous)
const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." }
});

/**
 * ✅ Fix: Rate limiter BEFORE verifyAdmin
 * This ensures CodeQL won’t complain about missing rate limiting.
 */

// Create / update / delete tours (admin only)
router.post("/", adminLimiter, verifyAdmin, createTour);
router.put("/:id", adminLimiter, verifyAdmin, updateTour);
router.delete("/:id", adminLimiter, verifyAdmin, deleteTour);

// Public read routes (rate-limited)
router.get("/:id", readLimiter, getSingleTour);
router.get("/", readLimiter, getAllTour);
router.get("/search/getTourBySearch", readLimiter, getTourBysearch);
router.get("/search/getFeaturedTours", readLimiter, getFeaturedTour);
router.get("/search/getTourCount", readLimiter, getTourCount);

export default router;
