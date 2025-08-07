const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    visitorName: {
      type: String,
      required: true,
    },
    visitorEmail: {
      type: String,
    },
    visitorPhone: {
      type: String,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String, // "10:30", "16:00", etc.
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    note: {
      type: String,
    },
    source: {
      type: String, // e.g. "web", "qr", "link"
      default: "web",
    },
    userAgent: String,
    deviceType: {
      type: String,
      enum: ["desktop", "tablet", "mobile", "unknown"],
      default: "unknown",
    },
  },
  { timestamps: true }
);

// Index for quick search
appointmentSchema.index({ cardId: 1, appointmentDate: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
