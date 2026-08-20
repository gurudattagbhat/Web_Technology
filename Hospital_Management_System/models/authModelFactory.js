const mongoose = require('mongoose');

const authSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    identifier: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      default: null,
    },
    gender: {
      type: String,
      default: 'Not specified',
    },
    phone: {
      type: String,
      default: '',
    },
    bloodGroup: {
      type: String,
      default: 'A+',
    },
    medicalHistory: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: 'General Medicine',
    },
    qualification: {
      type: String,
      default: 'MD / Specialist',
    },
    experience: {
      type: String,
      default: '10+ Years',
    },
    opdRoom: {
      type: String,
      default: 'Room 101, Main Block',
    },
    opdHours: {
      type: String,
      default: 'Mon - Sat: 9:00 AM - 4:00 PM',
    },
    consultationFee: {
      type: Number,
      default: 500,
    },
    bio: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = function createAuthModel(modelName, collectionName) {
  return mongoose.models[modelName] || mongoose.model(modelName, authSchema, collectionName);
};