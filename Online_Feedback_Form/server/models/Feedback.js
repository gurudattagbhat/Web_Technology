import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    regNo: {
      type: String,
      required: [true, 'Registration Number is required'],
      trim: true,
      uppercase: true,
    },
    studentName: {
      type: String,
      required: [true, 'Student Name is required'],
      trim: true,
    },
    clgEmail: {
      type: String,
      required: [true, 'College Email is required'],
      trim: true,
      lowercase: true,
    },
    phnNo: {
      type: String,
      required: [true, 'Phone Number is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject selection is required'],
      trim: true,
    },
    faculty: {
      type: String,
      required: [true, 'Faculty selection is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Faculty Rating (out of 5) is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    queriesSuggestions: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for quick searching
feedbackSchema.index({ regNo: 'text', studentName: 'text', faculty: 'text', subject: 'text' });

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default Feedback;
