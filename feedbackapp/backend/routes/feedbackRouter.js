const express = require("express");
const router = express.Router();
const controller = require("../controllers/feedbackController");
const {
  basicAuth,
  requireAdmin,
  requireUser,
} = require("../../../middleware/basicAuth.js");
const { validateInput, schemas } = require("../../../middleware/security.js");

// Public route - no authentication required
router.get("/feedbacks", controller.getFeedback);

// Protected routes - require authentication
router.post(
  "/createfeedback",
  basicAuth,
  requireUser,
  validateInput(schemas.feedback),
  controller.addFeedback
);

router.post(
  "/updatefeedback",
  basicAuth,
  requireAdmin,
  validateInput(schemas.feedback),
  controller.updateFeedback
);

router.post(
  "/deletefeedback",
  basicAuth,
  requireAdmin,
  controller.deleteFeedback
);

module.exports = router;
