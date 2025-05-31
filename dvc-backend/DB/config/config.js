const mongoose = require("mongoose");
require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";
const dbURI = isProd
  ? process.env.MONGODB_URI_PROD
  : process.env.MONGODB_URI_LOCAL;

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
