// In your server routes (e.g., /routes/cards.js)
const express = require("express");
const router = express.Router();
const Card = require("../models/card.model");
const { authenticateUser } = require("../middlewares/auth.middleware");

// Get all cards created by the logged-in user
router.get("/my-cards", authenticateUser, async (req, res) => {
  try {
    // Get userId from authenticated user
    const userId = req.user._id;

    // Find all cards created by this user
    const cards = await Card.find({ userId })
      .sort({ createdAt: -1 }) // Sort by creation date (newest first)
      .select("-__v"); // Exclude version field

    res.json(cards);
  } catch (error) {
    console.error("Error fetching user cards:", error);
    res.status(500).json({ error: "Failed to retrieve cards" });
  }
});

module.exports = router;
