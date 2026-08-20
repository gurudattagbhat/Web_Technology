import express from 'express';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// Sample seed dataset for testing report generation
const SAMPLE_FEEDBACKS = [
  {
    regNo: '21MCA0101',
    studentName: 'Aarav Sharma',
    clgEmail: 'aarav.21mca@college.edu',
    phnNo: '9876543210',
    subject: 'Web Technologies',
    faculty: 'Dr. Rajesh Kumar',
    rating: 5,
    queriesSuggestions: 'Excellent teaching style and interactive lab sessions!',
  },
  {
    regNo: '21MCA0102',
    studentName: 'Ananya Verma',
    clgEmail: 'ananya.21mca@college.edu',
    phnNo: '9876543211',
    subject: 'Web Technologies',
    faculty: 'Dr. Rajesh Kumar',
    rating: 4,
    queriesSuggestions: 'Please share slides prior to lectures.',
  },
  {
    regNo: '21MCA0103',
    studentName: 'Rohan Gupta',
    clgEmail: 'rohan.21mca@college.edu',
    phnNo: '9876543212',
    subject: 'Database Systems',
    faculty: 'Prof. Sunita Patel',
    rating: 5,
    queriesSuggestions: 'SQL queries session was super helpful.',
  },
  {
    regNo: '21MCA0104',
    studentName: 'Priya Nambiar',
    clgEmail: 'priya.21mca@college.edu',
    phnNo: '9876543213',
    subject: 'Data Structures',
    faculty: 'Dr. Vikramaditya',
    rating: 3,
    queriesSuggestions: 'Algorithm complexity concepts need more practice problems.',
  },
  {
    regNo: '21MCA0105',
    studentName: 'Karthik Iyer',
    clgEmail: 'karthik.21mca@college.edu',
    phnNo: '9876543214',
    subject: 'Cloud Computing',
    faculty: 'Prof. Anita Roy',
    rating: 4,
    queriesSuggestions: 'AWS lab access was smooth.',
  },
  {
    regNo: '21MCA0106',
    studentName: 'Sneha Kulkarni',
    clgEmail: 'sneha.21mca@college.edu',
    phnNo: '9876543215',
    subject: 'Artificial Intelligence',
    faculty: 'Dr. Amitav Ghosh',
    rating: 5,
    queriesSuggestions: 'Loved the Neural Network workshop!',
  },
  {
    regNo: '21MCA0107',
    studentName: 'Devansh Reddy',
    clgEmail: 'devansh.21mca@college.edu',
    phnNo: '9876543216',
    subject: 'Database Systems',
    faculty: 'Prof. Sunita Patel',
    rating: 4,
    queriesSuggestions: 'Great explanation of indexing.',
  },
  {
    regNo: '21MCA0108',
    studentName: 'Meera Menon',
    clgEmail: 'meera.21mca@college.edu',
    phnNo: '9876543217',
    subject: 'Web Technologies',
    faculty: 'Dr. Rajesh Kumar',
    rating: 5,
    queriesSuggestions: 'Node.js and MongoDB project was engaging.',
  },
];

// POST /api/feedback - Submit new feedback
router.post('/', async (req, res) => {
  try {
    const { regNo, studentName, clgEmail, phnNo, subject, faculty, rating, queriesSuggestions } = req.body;

    // Field level validation
    const missingFields = [];
    if (!regNo) missingFields.push('Reg no');
    if (!studentName) missingFields.push('Student Name');
    if (!clgEmail) missingFields.push('Clg Email id');
    if (!phnNo) missingFields.push('Phn no');
    if (!subject) missingFields.push('Select Sub');
    if (!faculty) missingFields.push('About faculty');
    if (rating === undefined || rating === null) missingFields.push('Faculty rating');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Faculty rating must be between 1 and 5',
      });
    }

    const newFeedback = new Feedback({
      regNo: regNo.trim(),
      studentName: studentName.trim(),
      clgEmail: clgEmail.trim(),
      phnNo: phnNo.trim(),
      subject: subject.trim(),
      faculty: faculty.trim(),
      rating: numericRating,
      queriesSuggestions: (queriesSuggestions || '').trim(),
    });

    const savedFeedback = await newFeedback.save();

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted and saved to MongoDB successfully!',
      data: savedFeedback,
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error while saving feedback',
    });
  }
});

// GET /api/feedback - Retrieve all feedbacks (with search/filter)
router.get('/', async (req, res) => {
  try {
    const { search, subject, faculty, rating } = req.query;
    let query = {};

    if (subject && subject !== 'All') {
      query.subject = subject;
    }

    if (faculty && faculty !== 'All') {
      query.faculty = faculty;
    }

    if (rating && rating !== 'All') {
      query.rating = Number(rating);
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { regNo: searchRegex },
        { studentName: searchRegex },
        { clgEmail: searchRegex },
        { queriesSuggestions: searchRegex },
      ];
    }

    const feedbacks = await Feedback.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback records',
    });
  }
});

// GET /api/feedback/report - Aggregated Report Metrics & Analytics
router.get('/report', async (req, res) => {
  try {
    const totalCount = await Feedback.countDocuments();

    if (totalCount === 0) {
      return res.status(200).json({
        success: true,
        summary: {
          totalFeedbacks: 0,
          overallAverageRating: 0,
          topFaculty: 'N/A',
          totalSubjects: 0,
          totalFaculties: 0,
        },
        facultyReport: [],
        subjectReport: [],
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      });
    }

    // Overall Average Rating
    const avgResult = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);
    const overallAvg = avgResult.length > 0 ? parseFloat(avgResult[0].avgRating.toFixed(2)) : 0;

    // Faculty-wise Breakdown
    const facultyReport = await Feedback.aggregate([
      {
        $group: {
          _id: '$faculty',
          subject: { $first: '$subject' },
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          ratings: { $push: '$rating' },
        },
      },
      { $sort: { avgRating: -1, count: -1 } },
    ]);

    const formattedFacultyReport = facultyReport.map((f) => {
      const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      f.ratings.forEach((r) => {
        if (dist[r] !== undefined) dist[r]++;
      });
      return {
        faculty: f._id,
        subject: f.subject,
        totalFeedback: f.count,
        avgRating: parseFloat(f.avgRating.toFixed(2)),
        distribution: dist,
      };
    });

    // Subject-wise Breakdown
    const subjectReport = await Feedback.aggregate([
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
      { $sort: { avgRating: -1 } },
    ]);

    const formattedSubjectReport = subjectReport.map((s) => ({
      subject: s._id,
      totalFeedback: s.count,
      avgRating: parseFloat(s.avgRating.toFixed(2)),
    }));

    // Overall Star Rating Distribution (1 to 5)
    const ratingDistRaw = await Feedback.aggregate([
      { $group: { _id: '$rating', count: { $sum: 1 } } },
    ]);

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistRaw.forEach((r) => {
      if (ratingDistribution[r._id] !== undefined) {
        ratingDistribution[r._id] = r.count;
      }
    });

    const topFaculty = formattedFacultyReport.length > 0 ? formattedFacultyReport[0].faculty : 'N/A';

    return res.status(200).json({
      success: true,
      summary: {
        totalFeedbacks: totalCount,
        overallAverageRating: overallAvg,
        topFaculty,
        totalSubjects: formattedSubjectReport.length,
        totalFaculties: formattedFacultyReport.length,
      },
      facultyReport: formattedFacultyReport,
      subjectReport: formattedSubjectReport,
      ratingDistribution,
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate report analytics',
    });
  }
});

// POST /api/feedback/seed - Seed sample feedback data for testing report generation
router.post('/seed', async (req, res) => {
  try {
    await Feedback.deleteMany({});
    const inserted = await Feedback.insertMany(SAMPLE_FEEDBACKS);
    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} sample feedback records!`,
      count: inserted.length,
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed sample data',
    });
  }
});

// DELETE /api/feedback/:id - Delete single feedback entry
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Feedback record not found' });
    }
    return res.status(200).json({ success: true, message: 'Feedback record deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting feedback record' });
  }
});

// DELETE /api/feedback/clear/all - Clear all feedback entries
router.delete('/clear/all', async (req, res) => {
  try {
    await Feedback.deleteMany({});
    return res.status(200).json({ success: true, message: 'All feedback records cleared' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error clearing feedback records' });
  }
});

export default router;
