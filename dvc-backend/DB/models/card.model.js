const mongoose = require("mongoose");
// models/card.model.js
const cardSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },

  // Personal Information
  name: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },

  // Social Links
  linkedin: {
    type: String,
    trim: true,
  },
  twitter: {
    type: String,
    trim: true,
  },
  instagram: {
    type: String,
    trim: true,
  },
  github: {
    type: String,
    trim: true,
  },

  // Card Style Options
  theme: {
    type: String,
    default: "blue",
  },
  fontStyle: {
    type: String,
    default: "sans-serif",
  },
  logoUrl: {
    type: String,
    trim: true,
  },
  // Background options
  backgroundType: {
    type: String,
    enum: ["color", "image"],
    default: "color",
  },
  backgroundImage: String,

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  // Card URL (public sharing)
  cardUrl: {
    type: String,
  },
  products: [
    {
      name: { type: String, required: true },
      images: [String], // URLs to product images
      price: { type: String }, // Using string to allow ranges like "$10-$20"
      description: { type: String },
      category: { type: String },
      featured: { type: Boolean, default: false },
      ctaType: {
        type: String,
        enum: ["inquiry", "buy", "contact"],
        default: "inquiry",
      },
      ctaLink: { type: String }, // External link for "Buy Now"
    },
  ],

  businessHours: {
    monday: { open: String, close: String, isOpen: Boolean },
    tuesday: { open: String, close: String, isOpen: Boolean },
    wednesday: { open: String, close: String, isOpen: Boolean },
    thursday: { open: String, close: String, isOpen: Boolean },
    friday: { open: String, close: String, isOpen: Boolean },
    saturday: { open: String, close: String, isOpen: Boolean },
    sunday: { open: String, close: String, isOpen: Boolean },
    // ... other days
  },

  testimonials: [
    {
      name: { type: String },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      date: { type: Date, default: Date.now },
      approved: { type: Boolean, default: false },
    },
  ],

  promotions: [
    {
      title: { type: String },
      description: { type: String },
      validUntil: { type: Date },
      discountCode: { type: String },
    },
  ],
});

// Update the updatedAt field before saving
cardSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Generate a unique card URL if not already set
  if (!this.cardUrl) {
    this.cardUrl = `card-${this._id}`;
  }

  next();
});

module.exports = mongoose.model("Card", cardSchema);
