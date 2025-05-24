const jwt = require("jsonwebtoken");
const Users = require("../models/user.model");

// JWT secret key (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const JWT_EXPIRES_IN = "24h"; // Token expiration time

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find().sort({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = new Users(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await Users.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ error: "Users not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Users not found" });
    }
    res.json({ message: "Users deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fix your userController.js file - Adjust the login function for troubleshooting

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await Users.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // In production, use bcrypt.compare instead of direct comparison
    // const isPasswordValid = await bcrypt.compare(password, user.password);

    // For troubleshooting purposes (REPLACE WITH PROPER BCRYPT IN PRODUCTION)
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create user object for token payload (avoid including password)
    const userForToken = {
      id: user._id.toString(),
      email: user.email,
      // Add any other non-sensitive user data needed in the frontend
    };

    // Generate JWT token
    const token = jwt.sign(userForToken, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Return user info and token
    res.json({
      user: {
        _id: user._id,
        email: user.email,
        // Add other user fields as needed (except password)
      },
      token,
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
};

// Example middleware for JWT token verification (use this for protected routes)
exports.authenticateToken = (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err.message);
        return res.status(403).json({ error: "Invalid or expired token" });
      }

      // Add decoded user data to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Server error during authentication" });
  }
};
