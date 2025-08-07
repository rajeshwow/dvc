// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const appointmentController = require("../controllers/appointment.controller");

// router.get("/", userController.getAllUsers);
// router.put("/:id", userController.updateUser);
// router.delete("/:id", userController.deleteUser);

router.post("/scheduler", appointmentController.appointmentScheduler);

module.exports = router;
