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

// Rate limiter for admin-modifying routes (POST/PUT/DELETE)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // allow 20 requests per IP
  message: { error: "Too many admin requests, please try again later." }
});

//create new tour
router.post("/", verifyAdmin, adminLimiter, createTour);

//update tour
router.put("/:id", verifyAdmin, adminLimiter, updateTour);

//delete tour
router.delete("/:id", verifyAdmin, adminLimiter, deleteTour);

// Public routes (kept unthrottled or you can add a general limiter if needed)
router.get("/:id", getSingleTour);
router.get("/", getAllTour);
router.get("/search/getTourBySearch", getTourBysearch);
router.get("/search/getFeaturedTours", getFeaturedTour);
router.get("/search/getTourCount", getTourCount);

export default router;
