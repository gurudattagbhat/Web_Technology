const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  regNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    default: 'Computer Applications'
  },
  semester: {
    type: String,
    default: 'MCA Semester II'
  },
  email: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
