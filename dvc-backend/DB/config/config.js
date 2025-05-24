const mongoose = require("mongoose");
require("dotenv").config();

// mongoose.connect("mongodb://localhost:27017/DVC");
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
