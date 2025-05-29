// controllers/analytics.controller.js
const CardAnalytic = require("../models/cardAnalytic.model");
const Card = require("../models/card.model");
const UAParser = require("ua-parser-js");
const mongoose = require("mongoose");

// Helper function to detect device type
const getDeviceType = (userAgent) => {
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const deviceType = device.type;

  if (deviceType === "mobile") return "mobile";
  if (deviceType === "tablet") return "tablet";
  return "desktop";
};

// Track a card view
// Updated trackView function
exports.trackView = async (req, res) => {
  try {
    const { cardId } = req.params;
    // Validate cardId format
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ error: "Invalid card ID format" });
    }

    // Improved viewer ID handling
    let viewerId;
    if (req?.cookies && req?.cookies?.viewerId) {
      viewerId = req.cookies.viewerId;
    } else if (req?.body && req?.body?.viewerId) {
      viewerId = req.body.viewerId;
    } else {
      viewerId = "v_" + Math.random().toString(36).substring(2, 15);
    }
    res.cookie("viewerId", viewerId, {
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      httpOnly: true,
      sameSite: "lax", // Changed from strict to lax for better cross-origin support
      secure: process.env.NODE_ENV === "production", // Only use secure in production
      path: "/", // Ensure cookie is available for all paths
    });
    if (!viewerId) {
      viewerId = "v_" + Math.random().toString(36).substring(2, 15);
      // Set cookie for future tracking
      res.cookie("viewerId", viewerId, {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        httpOnly: true,
        sameSite: "strict",
      });
    }

    // Extract user agent and referrer
    const userAgent = req.headers["user-agent"];
    const referrer = req?.body?.referrer || req.headers.referer || "direct";

    // Create a new view record - Convert cardId to ObjectId
    const cardAnalytic = new CardAnalytic({
      cardId: new mongoose.Types.ObjectId(cardId),
      viewerId,
      userAgent,
      deviceType: getDeviceType(userAgent),
      referrer,
      interactionType: "view",
    });

    await cardAnalytic.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to track view" });
  }
};

// Track card interactions (clicks, downloads, shares)
// Updated trackInteraction function
exports.trackInteraction = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { interactionType, interactionDetail, viewerId } = req.body;

    // Validate cardId format
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ error: "Invalid card ID format" });
    }

    // Validate interaction type
    const validInteractions = [
      "view",
      "contact_click",
      "social_click",
      "download",
      "share",
    ];
    if (!validInteractions.includes(interactionType)) {
      return res.status(400).json({ error: "Invalid interaction type" });
    }

    // Get or use viewer ID
    const currentViewerId =
      viewerId ||
      req?.cookies?.viewerId ||
      "v_" + Math.random().toString(36).substring(2, 15);

    // Create interaction record - Convert cardId to ObjectId
    const interaction = new CardAnalytic({
      cardId: new mongoose.Types.ObjectId(cardId),
      viewerId: currentViewerId,
      userAgent: req.headers["user-agent"],
      deviceType: getDeviceType(req.headers["user-agent"]),
      referrer: req.headers.referer || "direct",
      interactionType,
      interactionDetail,
    });

    await interaction.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to track interaction" });
  }
};

// Get analytics for a specific card (requires authentication)
// Updated getCardAnalytics function

exports.getCardAnalytics = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { timeframe } = req.query;

    // Validate cardId format
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ error: "Invalid card ID format" });
    }

    // Convert cardId to ObjectId for all queries
    const cardObjectId = new mongoose.Types.ObjectId(cardId);

    // Verify card belongs to user
    const card = await Card.findById(cardObjectId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Check ownership
    if (card.userId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "You don't have permission to view these analytics" });
    }

    // Get date range based on timeframe or use default (30 days)
    const endDate = new Date();
    let startDate;

    if (timeframe) {
      switch (timeframe) {
        case "7":
          startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30":
          startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90":
          startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "all":
          startDate = new Date(0); // Beginning of time
          break;
        default:
          startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
    } else {
      // Default to 30 days if no timeframe specified
      startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get view count - Use cardObjectId for all queries
    const viewCount = await CardAnalytic.countDocuments({
      cardId: cardObjectId,
      interactionType: "view",
      timestamp: { $gte: startDate, $lte: endDate },
    });

    // Get unique visitor count
    const uniqueVisitors = await CardAnalytic.distinct("viewerId", {
      cardId: cardObjectId,
      interactionType: "view",
      timestamp: { $gte: startDate, $lte: endDate },
    });

    // Get interaction counts
    const contactClicks = await CardAnalytic.countDocuments({
      cardId: cardObjectId,
      interactionType: "contact_click",
      timestamp: { $gte: startDate, $lte: endDate },
    });

    const socialClicks = await CardAnalytic.countDocuments({
      cardId: cardObjectId,
      interactionType: "social_click",
      timestamp: { $gte: startDate, $lte: endDate },
    });

    const downloads = await CardAnalytic.countDocuments({
      cardId: cardObjectId,
      interactionType: "download",
      timestamp: { $gte: startDate, $lte: endDate },
    });

    const shares = await CardAnalytic.countDocuments({
      cardId: cardObjectId,
      interactionType: "share",
      timestamp: { $gte: startDate, $lte: endDate },
    });

    // Get device breakdown
    const deviceBreakdown = await CardAnalytic.aggregate([
      {
        $match: {
          cardId: cardObjectId,
          interactionType: "view",
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$deviceType",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent activity for this card
    const recentActivity = await CardAnalytic.find({
      cardId: cardObjectId,
      timestamp: { $gte: startDate, $lte: endDate },
    })
      .sort({ timestamp: -1 })
      .limit(20);

    const formattedActivity = recentActivity.map((activity) => ({
      cardName: card.name,
      type: activity.interactionType,
      timestamp: activity.timestamp,
      location: "Unknown",
    }));

    // Get daily view counts
    const dailyViews = await CardAnalytic.aggregate([
      {
        $match: {
          cardId: cardObjectId,
          interactionType: "view",
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Format daily views for chart
    const formattedDailyViews = dailyViews.map((item) => ({
      date: `${item._id.year}-${item._id.month
        .toString()
        .padStart(2, "0")}-${item._id.day.toString().padStart(2, "0")}`,
      views: item.count,
    }));

    // Return data in consistent format
    res.json({
      totalViews: viewCount,
      totalShares: shares,
      totalDownloads: downloads,
      totalContacts: contactClicks,
      recentActivity: formattedActivity,
      cardStats: [
        {
          cardId: cardId,
          cardName: card.name,
          views: viewCount,
          shares: shares,
          downloads: downloads,
          contacts: contactClicks,
          engagementRate:
            viewCount > 0
              ? Math.round(
                  ((contactClicks + shares + downloads) / viewCount) * 100
                )
              : 0,
        },
      ],
      topPerformingCards: [
        {
          cardId: cardId,
          cardName: card.name,
          views: viewCount,
          shares: shares,
          downloads: downloads,
          contacts: contactClicks,
          totalEngagements: viewCount + shares + downloads + contactClicks,
        },
      ],
      // Keep original format for backward compatibility
      summary: {
        totalViews: viewCount,
        uniqueVisitors: uniqueVisitors.length,
        contactClicks,
        socialClicks,
        downloads,
        shares,
      },
      deviceBreakdown: deviceBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      dailyViews: formattedDailyViews,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to retrieve analytics" });
  }
};

// Get analytics for all user's cards
exports.getAllCardsAnalytics = async (req, res) => {
  try {
    const { days = "7" } = req.query;
    const userId = req.user._id;

    // Get user's cards
    const userCards = await Card.find({ userId });
    if (userCards.length === 0) {
      return res.json({
        totalViews: 0,
        totalShares: 0,
        totalDownloads: 0,
        totalContacts: 0,
        recentActivity: [],
        cardStats: [],
        topPerformingCards: [],
      });
    }

    const cardIds = userCards.map((card) => card._id);
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - parseInt(days));

    console.log("Card IDs:", cardIds);
    console.log("Date from:", dateFrom);

    // Get total counts for each interaction type
    const totalViews = await CardAnalytic.countDocuments({
      cardId: { $in: cardIds },
      interactionType: "view",
      timestamp: { $gte: dateFrom },
    });

    const totalShares = await CardAnalytic.countDocuments({
      cardId: { $in: cardIds },
      interactionType: "share",
      timestamp: { $gte: dateFrom },
    });

    const totalDownloads = await CardAnalytic.countDocuments({
      cardId: { $in: cardIds },
      interactionType: "download",
      timestamp: { $gte: dateFrom },
    });

    const totalContacts = await CardAnalytic.countDocuments({
      cardId: { $in: cardIds },
      interactionType: "contact_click",
      timestamp: { $gte: dateFrom },
    });

    // Get card-wise statistics
    const cardStats = [];
    for (const card of userCards) {
      const views = await CardAnalytic.countDocuments({
        cardId: card._id,
        interactionType: "view",
        timestamp: { $gte: dateFrom },
      });

      const shares = await CardAnalytic.countDocuments({
        cardId: card._id,
        interactionType: "share",
        timestamp: { $gte: dateFrom },
      });

      const downloads = await CardAnalytic.countDocuments({
        cardId: card._id,
        interactionType: "download",
        timestamp: { $gte: dateFrom },
      });

      const contacts = await CardAnalytic.countDocuments({
        cardId: card._id,
        interactionType: "contact_click",
        timestamp: { $gte: dateFrom },
      });

      const totalInteractions = shares + downloads + contacts;
      const engagementRate =
        views > 0 ? Math.round((totalInteractions / views) * 100) : 0;

      cardStats.push({
        cardId: card._id.toString(),
        cardName: card.name,
        views,
        shares,
        downloads,
        contacts,
        engagementRate,
      });
    }

    // Get recent activity
    const recentActivity = await CardAnalytic.find({
      cardId: { $in: cardIds },
      timestamp: { $gte: dateFrom },
    })
      .sort({ timestamp: -1 })
      .limit(20)
      .populate("cardId", "name");

    const formattedActivity = recentActivity.map((activity) => ({
      cardName: activity.cardId?.name || "Unknown Card",
      type: activity.interactionType,
      timestamp: activity.timestamp,
      location: "Unknown", // Add location logic if needed
    }));

    // Top performing cards
    const topPerformingCards = [...cardStats]
      .sort(
        (a, b) =>
          b.views +
          b.shares +
          b.downloads +
          b.contacts -
          (a.views + a.shares + a.downloads + a.contacts)
      )
      .slice(0, 5)
      .map((card) => ({
        ...card,
        totalEngagements:
          card.views + card.shares + card.downloads + card.contacts,
      }));

    const result = {
      totalViews,
      totalShares,
      totalDownloads,
      totalContacts,
      recentActivity: formattedActivity,
      cardStats,
      topPerformingCards,
    };

    console.log("Analytics result:", result);
    res.json(result);
  } catch (error) {
    console.error("Error fetching all cards analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

// Get analytics summary
exports.getAnalyticsSummary = async (req, res) => {
  try {
    const { days = "7" } = req.query;
    const userId = req.user._id;

    // Get user's cards
    const userCards = await Card.find({ userId });
    const cardIds = userCards.map((card) => card._id.toString());

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - parseInt(days));

    // Get total counts
    const totalCounts = await Analytics.aggregate([
      {
        $match: {
          cardId: { $in: cardIds },
          timestamp: { $gte: dateFrom },
        },
      },
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 },
        },
      },
    ]);

    const summary = {
      totalViews: 0,
      totalShares: 0,
      totalDownloads: 0,
      totalContacts: 0,
      totalCards: userCards.length,
    };

    totalCounts.forEach((item) => {
      switch (item._id) {
        case "view":
          summary.totalViews = item.count;
          break;
        case "share":
          summary.totalShares = item.count;
          break;
        case "download":
          summary.totalDownloads = item.count;
          break;
        case "contact":
          summary.totalContacts = item.count;
          break;
      }
    });

    res.json(summary);
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};

// Get top performing cards
exports.getTopPerformingCards = async (req, res) => {
  try {
    const { limit = "5", days = "30" } = req.query;
    // Implementation similar to the one in getAllCardsAnalytics
    // ... (implement based on your needs)

    res.json({ message: "Top performing cards endpoint" });
  } catch (error) {
    console.error("Error fetching top performing cards:", error);
    res.status(500).json({ error: "Failed to fetch top performing cards" });
  }
};

// Get recent activity
exports.getRecentActivity = async (req, res) => {
  try {
    const { limit = "20", days = "7" } = req.query;
    // Implementation similar to the one in getAllCardsAnalytics
    // ... (implement based on your needs)

    res.json({ message: "Recent activity endpoint" });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({ error: "Failed to fetch recent activity" });
  }
};
