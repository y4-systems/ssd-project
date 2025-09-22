import express from "express";
import rateLimit from "express-rate-limit";
import {
  updateUser,
  deleteUser,
  getSingleUser,
  getAllUser
} from "../controlles/userController.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// General limiter for user actions
const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please slow down." }
});

// Stricter limiter for sensitive actions (update/delete)
const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many attempts, please try again later." }
});

// Update User
router.put("/:id", verifyUser, sensitiveLimiter, updateUser);

// Delete User
router.delete("/:id", verifyUser, sensitiveLimiter, deleteUser);

// Get Single User
router.get("/:id", verifyUser, userLimiter, getSingleUser);

// Get All Users (admin only, also rate-limited)
router.get("/", verifyAdmin, userLimiter, getAllUser);

export default router;
