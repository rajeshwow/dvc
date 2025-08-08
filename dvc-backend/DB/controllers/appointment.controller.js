const AppointmentsScheduler = require("../models/appointmentScheduler.model");
const Appointment = require("../models/appointment.model");

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
    const existingScheduler = await AppointmentsScheduler.findOne({ userId });

    let result;
    if (existingScheduler) {
      // If exists, update
      result = await AppointmentsScheduler.findOneAndUpdate(
        { userId },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      return res.status(200).json({
        success: true,
        status: 200,
        message: "Scheduler updated successfully",
        data: result,
      });
    } else {
      // If not exists, create new
      const newScheduler = new AppointmentsScheduler(req.body);
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
//get appointment scheduler
exports.getAppointmentScheduler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const scheduler = await AppointmentsScheduler.findOne({ userId: userId });

    if (!scheduler) {
      return res.status(404).json({
        success: false,
        message: "Scheduler not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: scheduler,
    });
  } catch (error) {
    console.error("Error in getAppointmentScheduler:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
// create appointment
exports.createAppointment = async (req, res) => {
  try {
    const {
      userId,
      customerId,
      visitorName,
      visitorPhone,
      note,
      appointmentDate,
      appointmentTime,
    } = req.body;

    if (
      !userId ||
      !customerId ||
      !visitorName ||
      !visitorPhone ||
      !appointmentDate ||
      !appointmentTime
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Here you would typically save the appointment to a database
    // For now, we will just return the data as a mock response
    const newAppointment = {
      userId,
      customerId,
      visitorName,
      visitorPhone,
      note,
      appointmentDate,
      appointmentTime,
    };

    // Simulate saving to DB
    console.log("New appointment created:", newAppointment);

    const appointment = new Appointment(newAppointment);
    await appointment.save();

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: newAppointment,
      status: 201,
    });
  } catch (error) {
    console.error("Error in createAppointment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
//getallappointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Error in getAllAppointments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
//getappointmentofuser
exports.getAppointmentOfUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const appointments = await Appointment.find({ userId: userId });

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No appointments found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Error in getAppointmentOfUser:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
//approve appointment
exports.approveAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "appointmentId is required",
      });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = "Approved";
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment approved successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Error in approveAppointment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
//reject appointment
exports.rejectAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "appointmentId is required",
      });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    appointment.status = "Rejected";
    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment rejected successfully",
      data: appointment,
    });
  } catch (error) {
    console.error("Error in rejectAppointment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
