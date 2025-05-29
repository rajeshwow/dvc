// MongoDB model for card analytics
const mongoose = require("mongoose");

const cardViewSchema = new mongoose.Schema(
  {
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: true,
      index: true,
    },
    viewerId: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    // Capture device information
    userAgent: String,
    deviceType: {
      type: String,
      enum: ["desktop", "tablet", "mobile", "unknown"],
      default: "unknown",
    },
    // Location data (if available)
    country: String,
    city: String,
    // Referrer information
    referrer: String,
    // Interaction data
    interactionType: {
      type: String,
      enum: ["view", "share", "download", "contact_click", "social_click"], // UPDATED enum values
      default: "view",
    },
    interactionDetail: String,
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
cardViewSchema.index({ cardId: 1, timestamp: 1 });
cardViewSchema.index({ cardId: 1, interactionType: 1 });

const CardView = mongoose.model("CardView", cardViewSchema);

module.exports = CardView;
