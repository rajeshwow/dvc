const jwt = require("jsonwebtoken");
const Users = require("../models/user.model");
const crypto = require("crypto"); // ADD THIS LINE
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
// JWT secret key (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = "24h"; // Token expiration time

// Create email transporter (add this at the top of your controller file)
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Send email function
const sendResetEmail = async (email, resetToken) => {
  const transporter = createEmailTransporter();

  const resetUrl =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/reset-password/${resetToken}`
      : `https://dvc-brown.vercel.app/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You have requested to reset your password. Click the link below to reset your password:</p>
        <div style="margin: 20px 0;">
          <a href="${resetUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 12px;">
          This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
        </p>
        <p style="color: #666; font-size: 12px;">
          If the button doesn't work, copy and paste this link: <br>
          <a href="${resetUrl}">${resetUrl}</a>
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};

// Validate Reset Token Function
exports.validateResetToken = async (req, res) => {
  console.log("=== VALIDATE RESET TOKEN DEBUG ===");

  try {
    const { token } = req.params;
    console.log("Token from params:", token);

    if (!token) {
      console.log("❌ No token provided");
      return res.status(400).json({ error: "Token is required" });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    console.log("Hashed token:", hashedToken.substring(0, 8) + "...");

    // Find user with this token and check if it's not expired
    const user = await Users.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      console.log("❌ Invalid or expired token");
      return res.status(400).json({
        error: "Invalid or expired reset token",
      });
    }

    console.log("✅ Token is valid");
    res.json({
      message: "Token is valid",
      userId: user._id,
    });
  } catch (error) {
    console.error("❌ Error validating token:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

// Reset Password Function
exports.resetPassword = async (req, res) => {
  console.log("=== RESET PASSWORD DEBUG ===");
  console.log("Request body:", req.body);

  try {
    const { token, password } = req.body;

    // Validate input
    if (!token || !password) {
      console.log("❌ Missing token or password");
      return res.status(400).json({
        error: "Token and password are required",
      });
    }

    // Validate password strength
    if (password.length < 6) {
      console.log("❌ Password too short");
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    console.log("Token received:", token.substring(0, 8) + "...");

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    console.log("Hashed token:", hashedToken.substring(0, 8) + "...");

    // Find user with this token and check if it's not expired
    const user = await Users.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      console.log("❌ Invalid or expired token");
      return res.status(400).json({
        error: "Invalid or expired reset token",
      });
    }

    console.log("🔐 Hashing new password...");

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log("Password hashed successfully");

    // Update user's password and clear reset token fields
    console.log("💾 Updating user password...");

    const updatedUser = await Users.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
        // Optional: Track when password was last changed
        passwordChangedAt: new Date(),
      },
      {
        new: true,
        runValidators: false,
      }
    );

    if (!updatedUser) {
      console.log("❌ Failed to update user");
      return res.status(500).json({
        error: "Failed to update password",
      });
    }

    console.log("✅ Password reset successful");

    // Send success response
    res.json({
      message: "Password reset successful",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
      },
    });

    // Optional: Send confirmation email
    if (process.env.NODE_ENV === "production") {
      try {
        await sendPasswordResetConfirmationEmail(user.email);
        console.log("✅ Confirmation email sent");
      } catch (emailError) {
        console.error("❌ Failed to send confirmation email:", emailError);
        // Don't fail the request if email fails
      }
    }
  } catch (error) {
    console.error("❌ FATAL ERROR in resetPassword:", error);
    console.error("Error stack:", error.stack);

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Optional: Send password reset confirmation email
const sendPasswordResetConfirmationEmail = async (email) => {
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Reset Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Successful</h2>
        <p>Your password has been successfully reset.</p>
        <p>If you did not make this change, please contact our support team immediately.</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #28a745;">
          <p style="margin: 0; color: #155724;">
            <strong>Security Tip:</strong> Always use a strong, unique password for your account.
          </p>
        </div>
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

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

// Updated Forgot Password Function
exports.forgotPassword = async (req, res) => {
  console.log("=== FORGOT PASSWORD DEBUG ===");
  console.log("Raw request body:", req.body);
  console.log("Request headers:", req.headers);

  try {
    // Extract and validate email
    const email = req.body?.email;

    console.log("Extracted email:", email);
    console.log("Email type:", typeof email);

    if (!email || typeof email !== "string") {
      console.log("❌ Invalid email input");
      return res.status(400).json({
        error: "Valid email is required",
        received: email,
        type: typeof email,
      });
    }

    // Clean the email
    const cleanEmail = email.toLowerCase().trim();
    console.log("Cleaned email:", cleanEmail);

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(cleanEmail)) {
      console.log("❌ Invalid email format");
      return res.status(400).json({ error: "Invalid email format" });
    }

    console.log("🔍 Searching for user...");

    // Use a very simple query
    let user;
    try {
      user = await Users.findOne({ email: cleanEmail }).lean();
      console.log(
        "Database query result:",
        user ? "User found" : "User not found"
      );

      if (user) {
        console.log("Found user ID:", user._id);
        console.log("Found user email:", user.email);
      }
    } catch (dbError) {
      console.error("❌ Database query error:", dbError);
      return res.status(500).json({
        error: "Database error",
        details: dbError.message,
      });
    }

    // If user not found, still return success (security best practice)
    if (!user) {
      console.log("⚠️ User not found, but returning success for security");
      return res.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
        debug: "User not found",
      });
    }

    // Generate reset token
    console.log("🔑 Generating reset token...");
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    console.log("Reset token generated:", resetToken.substring(0, 8) + "...");
    console.log("Expiration time:", expirationTime);

    // Update user with reset token using findByIdAndUpdate
    console.log("💾 Updating user with reset token...");
    try {
      const updatedUser = await Users.findByIdAndUpdate(
        user._id,
        {
          passwordResetToken: hashedToken,
          passwordResetExpires: expirationTime,
        },
        {
          new: true,
          runValidators: false,
        }
      );

      console.log("Update successful:", updatedUser ? "Yes" : "No");

      if (!updatedUser) {
        console.log("❌ Failed to update user");
        return res.status(500).json({ error: "Failed to set reset token" });
      }
    } catch (updateError) {
      console.error("❌ Update error:", updateError);
      return res.status(500).json({
        error: "Failed to update user",
        details: updateError.message,
      });
    }

    // Send password reset email
    console.log("📧 Sending password reset email...");
    try {
      await sendResetEmail(cleanEmail, resetToken);
      console.log("✅ Password reset email sent successfully");
    } catch (emailError) {
      console.error("❌ Failed to send email:", emailError);
      // Don't expose email sending errors to the client for security
      // but log them for debugging
    }

    console.log("✅ Forgot password process completed successfully");

    // Return success response
    const response = {
      message:
        "If an account with that email exists, a password reset link has been sent.",
    };

    // Add debug info in development
    if (process.env.NODE_ENV === "development") {
      response.debug = {
        email: cleanEmail,
        token: resetToken,
        resetUrl: `http://localhost:3000/reset-password/${resetToken}`,
        expiresAt: expirationTime,
      };
    }

    res.json(response);
  } catch (error) {
    console.error("❌ FATAL ERROR in forgotPassword:", error);
    console.error("Error stack:", error.stack);

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Reset Password Function
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        error: "Token, new password, and password confirmation are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid reset token
    const user = await Users.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired password reset token",
      });
    }

    // Update password (in production, hash with bcrypt)
    // const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = newPassword; // REPLACE WITH HASHED PASSWORD IN PRODUCTION

    // Clear reset token fields
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // Generate new JWT token for automatic login
    const userForToken = {
      id: user._id.toString(),
      email: user.email,
    };

    const jwtToken = jwt.sign(userForToken, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      message: "Password reset successful",
      user: {
        _id: user._id,
        email: user.email,
      },
      token: jwtToken,
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Error resetting password" });
  }
};

// Get Reset Token Info (optional - to verify token before showing reset form)
exports.getResetTokenInfo = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid reset token
    const user = await Users.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired password reset token",
      });
    }

    res.json({
      valid: true,
      email: user.email, // You might want to mask this: u***@example.com
    });
  } catch (error) {
    console.error("Get reset token info error:", error);
    res.status(500).json({ error: "Error validating reset token" });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { email, name, sub, picture } = req.body;
    if (!email || !sub) {
      return res.status(400).json({ error: "Invalid Google user data" });
    }

    let user = await Users.findOne({ email });

    if (!user) {
      user = new Users({
        email,
        name,
        googleId: sub,
        profilePicture: picture,
        // password: false, // Not required for Google users
      });
      await user.save();
    }

    // Create token
    const userForToken = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(userForToken, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
      },
      token,
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ error: "Server error during Google login" });
  }
};
