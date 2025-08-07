const Appointments = require("../models/appointmentScheduler");

exports.appointmentScheduler = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // Check if scheduler already exists
    const existingScheduler = await Appointments.findOne({ userId });

    let result;
    if (existingScheduler) {
      // If exists, update
      result = await Appointments.findOneAndUpdate({ userId }, req.body, {
        new: true,
        runValidators: true,
      });

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Scheduler updated successfully",
        data: result,
      });
    } else {
      // If not exists, create new
      const newScheduler = new Appointments(req.body);
      result = await newScheduler.save();

      return res.status(201).json({
        success: true,
        status: 201,
        message: "Scheduler created successfully",
        data: result,
      });
    }
  } catch (error) {
    console.error("Error in appointmentScheduler:", error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};
