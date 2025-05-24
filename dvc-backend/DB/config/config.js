const mongoose = require("mongoose");
require("dotenv").config();

// mongoose.connect("mongodb://localhost:27017/DVC");

const isProd = process.env.NODE_ENV === "production";
const dbURI = isProd
  ? process.env.MONGODB_URI_PROD
  : process.env.MONGODB_URI_LOCAL;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
