require("dotenv").config();
const express = require("express");
require("./DB/config/config");
const app = express();
const cors = require("cors");
const path = require("path");
const userRoutes = require("./DB/routes/user.routes");
const cardRoutes = require("./DB/routes/card.routes");
const analyticsRoutes = require("./DB/routes/analytics.routes");
const appointmentRoutes = require("./DB/routes/appointment.routes");

const corsOptions = {
  // In production, use your specific domains
  origin:
    process.env.NODE_ENV === "production"
      ? [
          "https://dvc-brown.vercel.app",
          "https://www.cardflare.in",
          "https://cardflare.in",
        ]
      : [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:5000",
          "http://localhost:5173",
        ],
  credentials: true, // This is essential for cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/appointments", appointmentRoutes);

app.listen(5000);
