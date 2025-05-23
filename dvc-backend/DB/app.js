// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/config");
const userRoutes = require("./routes/user.routes");
const cardRoutes = require("./routes/card.routes"); // Add this line

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/cards", cardRoutes); // Add this line

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
