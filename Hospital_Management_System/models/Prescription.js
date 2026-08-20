const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
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
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    medicines: [
      {
        name: { type: String, required: true },
        dosage: { type: String, default: '1 tablet' },
        frequency: { type: String, default: 'Twice daily' },
        duration: { type: String, default: '5 days' },
      },
    ],
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema);
