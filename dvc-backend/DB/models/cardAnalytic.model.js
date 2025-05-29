// models/cardAnalytic.model.js
const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    // Card reference
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

    // interactionType type
    interactionType: {
      type: String,
      required: true,
      enum: ["view", "share", "download", "contact_click", "social_click"], // UPDATED enum values
      index: true,
    },

    // Timestamp
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Visitor information
    visitorInfo: {
      ip: String,
      userAgent: String,
      referrer: String,
      location: String, // Can be populated from IP geolocation
      device: String, // mobile, desktop, tablet
      browser: String, // chrome, firefox, safari, etc.
    },
    deviceType: {
      type: String,
      enum: ["desktop", "tablet", "mobile", "unknown"],
      default: "unknown",
    },

    // Event-specific data
    shareMethod: {
      type: String,
      enum: ["social", "email", "copy_link", "qr_code", "direct"],
    },

    contactType: {
      type: String,
      enum: ["email", "phone", "website"],
    },

    network: {
      type: String,
      enum: ["linkedin", "twitter", "instagram", "github", "facebook"],
    },

    // Additional metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
analyticsSchema.index({ cardId: 1, timestamp: -1 });
analyticsSchema.index({ cardId: 1, interactionType: 1, timestamp: -1 });
analyticsSchema.index({ timestamp: -1 });

// Static methods
analyticsSchema.statics.getCardStats = async function (cardId, days = 7) {
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);

  return this.aggregate([
    {
      $match: {
        cardId: cardId,
        timestamp: { $gte: dateFrom },
      },
    },
    {
      $group: {
        _id: "$interactionType",
        count: { $sum: 1 },
      },
    },
  ]);
};

analyticsSchema.statics.getUserStats = async function (cardIds, days = 7) {
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);

  return this.aggregate([
    {
      $match: {
        cardId: { $in: cardIds },
        timestamp: { $gte: dateFrom },
      },
    },
    {
      $group: {
        _id: {
          cardId: "$cardId",
          interactionType: "$interactionType",
        },
        count: { $sum: 1 },
      },
    },
  ]);
};

analyticsSchema.statics.getRecentActivity = async function (
  cardIds,
  limit = 20
) {
  return this.find({
    cardId: { $in: cardIds },
  })
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
};

// Virtual for formatted timestamp
analyticsSchema.virtual("formattedTimestamp").get(function () {
  return (
    this.timestamp.toLocaleDateString() +
    " " +
    this.timestamp.toLocaleTimeString()
  );
});

// Pre-save middleware to extract device/browser info
analyticsSchema.pre("save", function (next) {
  if (this.visitorInfo && this.visitorInfo.userAgent) {
    const userAgent = this.visitorInfo.userAgent.toLowerCase();

    // Simple device detection
    if (
      userAgent.includes("mobile") ||
      userAgent.includes("android") ||
      userAgent.includes("iphone")
    ) {
      this.visitorInfo.device = "mobile";
    } else if (userAgent.includes("tablet") || userAgent.includes("ipad")) {
      this.visitorInfo.device = "tablet";
    } else {
      this.visitorInfo.device = "desktop";
    }

    // Simple browser detection
    if (userAgent.includes("chrome")) {
      this.visitorInfo.browser = "chrome";
    } else if (userAgent.includes("firefox")) {
      this.visitorInfo.browser = "firefox";
    } else if (userAgent.includes("safari")) {
      this.visitorInfo.browser = "safari";
    } else if (userAgent.includes("edge")) {
      this.visitorInfo.browser = "edge";
    } else {
      this.visitorInfo.browser = "other";
    }
  }

  next();
});

const CardAnalytic = mongoose.model("CardAnalytic", analyticsSchema);

module.exports = CardAnalytic;
