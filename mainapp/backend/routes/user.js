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

// General limiter
const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please slow down." }
});

// Stricter limiter for sensitive ops
const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many attempts, please try again later." }
});

// Routes
router.put("/:id", verifyUser, sensitiveLimiter, updateUser);
router.delete("/:id", verifyUser, sensitiveLimiter, deleteUser);
router.get("/:id", verifyUser, userLimiter, getSingleUser);
router.get("/", verifyAdmin, userLimiter, getAllUser);

export default router;
