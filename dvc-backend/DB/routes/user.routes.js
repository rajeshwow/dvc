// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");

router.get("/", userController.getAllUsers);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post("/login", userController.loginUser);
router.post("/register", userController.createUser);
router.get("/profile", authenticateUser, userController.getCurrentUser);
// Google login route
router.post("/google-login", userController.googleLogin); // ✅ THIS LINE

// Password reset routes
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.get("/reset-token/:token", userController.getResetTokenInfo);
// Validate reset token route
router.get("/validate-reset-token/:token", userController.validateResetToken);

module.exports = router;
