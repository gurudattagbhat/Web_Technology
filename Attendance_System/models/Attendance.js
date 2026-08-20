const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentRegNo: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  date: {
    type: String, // Stored as 'YYYY-MM-DD' for accurate timezone-agnostic query
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'On-Duty', 'Leave'],
    default: 'Present'
  },
  remarks: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Compound index to ensure 1 record per student per date
attendanceSchema.index({ studentRegNo: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
