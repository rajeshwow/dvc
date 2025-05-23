const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Use the same secret key as in the authentication controller
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to authenticate user based on JWT token
exports.authenticateUser = async (req, res, next) => {
  try {
    // Check for token in headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Authentication token required" });
    }

    // Verify token with the same secret key used to generate the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Log the decoded token for debugging

    // Find user by ID - make sure the property name matches what was set in the token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Add user object to request
    req.user = user;

    // Log successful authentication

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }

    res.status(500).json({ error: "Authentication error" });
  }
};
