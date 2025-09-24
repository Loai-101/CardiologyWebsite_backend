const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { verifyAdminToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Book appointment (Public)
router.post('/', [
  body('patientName').notEmpty().withMessage('Patient name is required'),
  body('patientEmail').isEmail().withMessage('Please enter a valid email'),
  body('patientPhone').notEmpty().withMessage('Phone number is required'),
  body('appointmentDate').isISO8601().withMessage('Please enter a valid appointment date'),
  body('appointmentTime').notEmpty().withMessage('Appointment time is required'),
  body('doctor').notEmpty().withMessage('Doctor selection is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('reason').notEmpty().withMessage('Appointment reason is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate,
      appointmentTime,
      doctor,
      department,
      reason,
      notes
    } = req.body;

    // Validate appointment date is not in the past
    const appointmentDateTime = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDateTime < today) {
      return res.status(400).json({
        success: false,
        message: 'Appointment date cannot be in the past'
      });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate: appointmentDateTime,
      appointmentTime,
      doctor,
      department,
      reason,
      notes: notes || '',
      status: 'pending'
    });

    await newAppointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: {
        id: newAppointment._id,
        patientName: newAppointment.patientName,
        appointmentDate: newAppointment.appointmentDate,
        appointmentTime: newAppointment.appointmentTime,
        doctor: newAppointment.doctor,
        status: newAppointment.status
      }
    });

  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
      error: error.message
    });
  }
});

// Get all appointments (Admin only)
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    const { page = 1, limit = 50, status, date } = req.query;
    
    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = {
        $gte: startDate,
        $lt: endDate
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get appointments with pagination
    const appointments = await Appointment.find(query)
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      appointments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalAppointments: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message
    });
  }
});

// Get appointment by ID (Admin only)
router.get('/:id', verifyAdminToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment',
      error: error.message
    });
  }
});

// Update appointment status (Admin only)
router.patch('/:id/status', verifyAdminToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, confirmed, completed, cancelled'
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment status',
      error: error.message
    });
  }
});

// Delete appointment (Admin only)
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment',
      error: error.message
    });
  }
});

// Get appointment statistics (Admin only)
router.get('/stats/overview', verifyAdminToken, async (req, res) => {
  try {
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalAppointments = await Appointment.countDocuments();
    
    // Format stats
    const statusStats = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    };

    stats.forEach(stat => {
      statusStats[stat._id] = stat.count;
    });

    res.json({
      success: true,
      stats: {
        total: totalAppointments,
        ...statusStats
      }
    });
  } catch (error) {
    console.error('Error fetching appointment statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment statistics',
      error: error.message
    });
  }
});

module.exports = router;
