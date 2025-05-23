// models/cardAnalytic.model.js
const mongoose = require("mongoose");

const cardAnalyticSchema = new mongoose.Schema(
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
    // Referrer information
    referrer: String,
    // Interaction data
    interactionType: {
      type: String,
      enum: ["view", "contact_click", "social_click", "download", "share"],
      default: "view",
    },
    interactionDetail: String,
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
cardAnalyticSchema.index({ cardId: 1, timestamp: 1 });
cardAnalyticSchema.index({ cardId: 1, interactionType: 1 });

const CardAnalytic = mongoose.model("CardAnalytic", cardAnalyticSchema);

module.exports = CardAnalytic;
