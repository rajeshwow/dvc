// routes/card.routes.js
const express = require("express");
const router = express.Router();
const cardController = require("../controllers/card.controller");
const { authenticateUser } = require("../middlewares/auth.middleware"); // You'll need to create this middleware
const {
  uploadProductImage,
  uploadMultipleProductImages,
} = require("../middlewares/uploadMiddleware");

// Get all cards for the authenticated user
router.get("/", authenticateUser, cardController.getUserCards);

// Create a new card
router.post("/", authenticateUser, cardController.createCard);

// Get a single card by ID
router.get("/:id", cardController.getCardById);

// Update a card
router.put("/:id", authenticateUser, cardController.updateCard);

// Delete a card
router.delete("/:id", authenticateUser, cardController.deleteCard);

// GET /api/cards/:cardId/products
// Get all products for a card
router.get("/:cardId/products", cardController.getCardProducts);

// POST /api/cards/:cardId/products
// Add a new product to a card
router.post(
  "/:cardId/products",
  authenticateUser,
  uploadMultipleProductImages,
  cardController.addCardProduct
);
router.put(
  "/:cardId/products/:productId",
  authenticateUser,
  cardController.updateCardProduct
);

// DELETE /api/cards/:cardId/products/:productId
// Delete a product
router.delete(
  "/:cardId/products/:productId",
  authenticateUser,
  cardController.deleteCardProduct
);

// GET /api/cards/:cardId/hours
// Get business hours for a card
router.get("/:cardId/hours", cardController.getBusinessHours);

// PUT /api/cards/:cardId/hours
// Update business hours
router.put(
  "/:cardId/hours",
  authenticateUser,
  cardController.updateBusinessHours
);

// GET /api/cards/:cardId/testimonials
// Get testimonials for a card
router.get("/:cardId/testimonials", cardController.getTestimonials);

// POST /api/cards/:cardId/testimonials
// Add a new testimonial
router.post("/:cardId/testimonials", cardController.addTestimonial);

// PUT /api/cards/:cardId/testimonials/:testimonialId/approve
// Approve a testimonial (owner only)
router.put(
  "/:cardId/testimonials/:testimonialId/approve",
  authenticateUser,
  cardController.approveTestimonial
);

// DELETE /api/cards/:cardId/testimonials/:testimonialId
// Delete a testimonial (owner only)
router.delete(
  "/:cardId/testimonials/:testimonialId",
  authenticateUser,
  cardController.deleteTestimonial
);

module.exports = router;
