// routes/analytics.routes.js
const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");

// Public tracking endpoints (no auth required)
router.post("/track/view/:cardId", analyticsController.trackView);
router.post("/track/interaction/:cardId", analyticsController.trackInteraction);

// Protected endpoint (auth required) - get analytics data
router.get(
  "/cards/:cardId",
  authenticateUser,
  analyticsController.getCardAnalytics
);

module.exports = router;
