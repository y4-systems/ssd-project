// mainapp/backend/routes/tour.js
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
} from "./../controllers/tourController.js";
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
 * Public search & info endpoints
 * Put specific routes BEFORE any param route like "/:id"
 */
router.get("/search", readLimiter, getTourBysearch);
router.get("/featured", readLimiter, getFeaturedTour);
router.get("/count", readLimiter, getTourCount);

/**
 * CRUD endpoints (admin-protected with stricter rate limiting)
 */
router.post("/", verifyAdmin, adminLimiter, createTour);
router.put("/:id", verifyAdmin, adminLimiter, updateTour);
router.delete("/:id", verifyAdmin, adminLimiter, deleteTour);

/**
 * Param route AFTER specific routes so it won't swallow /search /featured /count
 */
router.get("/:id", readLimiter, getSingleTour);
router.get("/", readLimiter, getAllTour);

export default router;
