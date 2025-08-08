const mongoose = require("mongoose");

const appointmentSchedulerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      unique: true, // one config per user
    },
    activeDays: {
      type: [String], // e.g. ["Monday", "Tuesday"]
      required: true,
    },
    timeRanges: {
      type: Map,
      of: [String], // e.g. { Monday: ["10:00", "18:00"] }
      required: true,
    },
    slotDuration: {
      type: Number, // in minutes
      default: 30,
    },
  },
  {
    timestamps: true,
  }
);

// Optional index for queries

const AppointmentSchedulerConfig = mongoose.model(
  "AppointmentSchedulerConfig",
  appointmentSchedulerSchema
);

module.exports = AppointmentSchedulerConfig;
