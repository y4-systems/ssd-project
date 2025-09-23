// mainapp/backend/routes/tour.js
import express from "express";
import {
  createTour,
  updateTour,
  deleteTour,
  getSingleTour,
  getAllTour,
  getTourBysearch,
  getFeaturedTour,
  getTourCount,
} from "./../controlles/tourController.js"; // <-- NOTE: 'controllers', not 'controlles'
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

/**
 * Public search & info endpoints
 * Put specific routes BEFORE any param route like "/:id"
 */

// GET /api/v1/tours/search?city=...&distance=...&maxGroupSize=...
router.get("/search", getTourBysearch);

// GET /api/v1/tours/featured
router.get("/featured", getFeaturedTour);

// GET /api/v1/tours/count
router.get("/count", getTourCount);

/**
 * CRUD endpoints (admin-protected where needed)
 */

// POST /api/v1/tours
router.post("/", verifyAdmin, createTour);

// PUT /api/v1/tours/:id
router.put("/:id", verifyAdmin, updateTour);

// DELETE /api/v1/tours/:id
router.delete("/:id", verifyAdmin, deleteTour);

/**
 * Param route AFTER specific routes so it won't swallow /search /featured /count
 */

// GET /api/v1/tours/:id
router.get("/:id", getSingleTour);

// GET /api/v1/tours
router.get("/", getAllTour);

export default router;
