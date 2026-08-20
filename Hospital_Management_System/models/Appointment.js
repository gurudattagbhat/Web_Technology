const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    patientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    doctorEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    doctorName: {
      type: String,
      default: 'Dr. On Duty',
    },
    date: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      default: 'General Checkup',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
