const express = require("express");
const router = express.Router();
const controller = require("../controllers/feedbackController");
const { basicAuth, requireAdmin } = require("../../../middleware/basicAuth.js");

router.get("/feedbacks", controller.getFeedback);
router.post("/createfeedback", basicAuth, controller.addFeedback);
router.post(
  "/updatefeedback",
  basicAuth,
  requireAdmin,
  controller.updateFeedback
);
router.post(
  "/deletefeedback",
  basicAuth,
  requireAdmin,
  controller.deleteFeedback
);

module.exports = router;
