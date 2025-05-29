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

// Get analytics for all user's cards (authenticated user)
router.get(
  "/all-cards",
  authenticateUser,
  analyticsController.getAllCardsAnalytics
);

// Get analytics summary (authenticated user)
router.get(
  "/summary",
  authenticateUser,
  analyticsController.getAnalyticsSummary
);

// Get top performing cards (authenticated user)
router.get(
  "/top-cards",
  authenticateUser,
  analyticsController.getTopPerformingCards
);

// Get recent activity (authenticated user)
router.get(
  "/recent-activity",
  authenticateUser,
  analyticsController.getRecentActivity
);

module.exports = router;
