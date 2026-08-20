const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const Student = require('./models/Student');
const Attendance = require('./models/Attendance');
const seedDatabase = require('./seed');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attendance_db';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let mongoConnected = false;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    mongoConnected = true;
    console.log(`✅ Connected to MongoDB at ${MONGO_URI}`);
    
    // Auto-seed if database is empty
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      console.log('⚡ Empty database detected. Auto-seeding initial records...');
      await seedDatabase(MONGO_URI);
    }
  })
  .catch(err => {
    mongoConnected = false;
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// --- API ENDPOINTS ---

// Server & DB Status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    mongoConnected: mongoose.connection.readyState === 1,
    databaseName: mongoose.connection.name || 'attendance_db',
    port: PORT
  });
});

// Get list of all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ regNo: 1 });
    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single student details
app.get('/api/students/:regNo', async (req, res) => {
  try {
    const regNo = req.params.regNo.trim().toUpperCase();
    const student = await Student.findOne({ regNo });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add a new student
app.post('/api/students', async (req, res) => {
  try {
    const { regNo, name, department, semester, email } = req.body;
    if (!regNo || !name) {
      return res.status(400).json({ success: false, error: 'RegNo and Name are required.' });
    }

    const uppercaseReg = regNo.trim().toUpperCase();
    const existing = await Student.findOne({ regNo: uppercaseReg });
    if (existing) {
      return res.status(409).json({ success: false, error: `Student with RegNo ${uppercaseReg} already exists.` });
    }

    const newStudent = new Student({
      regNo: uppercaseReg,
      name: name.trim(),
      department: department || 'Master of Computer Applications',
      semester: semester || 'Sem II',
      email: email || ''
    });

    await newStudent.save();
    res.status(201).json({ success: true, data: newStudent });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update student details
app.put('/api/students/:regNo', async (req, res) => {
  try {
    const regNo = req.params.regNo.trim().toUpperCase();
    const { name, department, semester, email } = req.body;

    const student = await Student.findOneAndUpdate(
      { regNo },
      { name, department, semester, email },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete student and their attendance records from MongoDB
app.delete('/api/students/:regNo', async (req, res) => {
  try {
    const regNo = req.params.regNo.trim().toUpperCase();
    const student = await Student.findOneAndDelete({ regNo });
    
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    // Delete associated attendance logs
    const deleteLogs = await Attendance.deleteMany({ studentRegNo: regNo });

    res.json({
      success: true,
      message: `Student ${regNo} and ${deleteLogs.deletedCount} attendance records deleted from MongoDB.`,
      data: student
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get attendance records for all students on a specific date (For Attendance Taking Sheet)
app.get('/api/attendance/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const students = await Student.find().sort({ regNo: 1 });
    const records = await Attendance.find({ date });

    const recordMap = {};
    records.forEach(r => {
      recordMap[r.studentRegNo] = r;
    });

    const sheetData = students.map(student => ({
      regNo: student.regNo,
      name: student.name,
      department: student.department,
      status: recordMap[student.regNo] ? recordMap[student.regNo].status : 'Present',
      remarks: recordMap[student.regNo] ? recordMap[student.regNo].remarks : ''
    }));

    res.json({ success: true, date, data: sheetData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Bulk mark attendance for entire class on a specific date
app.post('/api/attendance/bulk-mark', async (req, res) => {
  try {
    const { date, records } = req.body;
    if (!date || !Array.isArray(records)) {
      return res.status(400).json({ success: false, error: 'Date and records array are required.' });
    }

    const operations = records.map(item => ({
      updateOne: {
        filter: { studentRegNo: item.regNo.trim().toUpperCase(), date },
        update: {
          studentRegNo: item.regNo.trim().toUpperCase(),
          date,
          status: item.status || 'Present',
          remarks: item.remarks || ''
        },
        upsert: true
      }
    }));

    if (operations.length > 0) {
      await Attendance.bulkWrite(operations);
    }

    res.json({ success: true, message: `Attendance saved for ${operations.length} students on ${date}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Attendance Calculation Endpoint (Core requirement from prompt & image)
app.post('/api/attendance/calculate', async (req, res) => {
  try {
    const { regNo, fromDate, toDate } = req.body;

    if (!regNo) {
      return res.status(400).json({ success: false, error: 'Register Number (RegNo) is required.' });
    }

    const cleanRegNo = regNo.trim().toUpperCase();

    // 1. Fetch Student from MongoDB
    let student = await Student.findOne({ regNo: cleanRegNo });
    
    // If student not in DB, return error or handle gracefully
    if (!student) {
      return res.status(404).json({ success: false, error: `Student with RegNo '${cleanRegNo}' not found in MongoDB.` });
    }

    // Build MongoDB Date Filter
    const filter = { studentRegNo: cleanRegNo };

    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = fromDate;
      if (toDate) filter.date.$lte = toDate;
    }

    // 2. Query Attendance records from MongoDB
    const records = await Attendance.find(filter).sort({ date: 1 });

    const totalWorkingDays = records.length;
    let presentDays = 0;
    let absentDays = 0;
    let onDutyDays = 0;
    let leaveDays = 0;

    records.forEach(r => {
      if (r.status === 'Present') presentDays++;
      else if (r.status === 'Absent') absentDays++;
      else if (r.status === 'On-Duty') onDutyDays++;
      else if (r.status === 'Leave') leaveDays++;
    });

    // Effective present count includes Present + On-Duty
    const effectivePresent = presentDays + onDutyDays;

    let percentage = 0;
    if (totalWorkingDays > 0) {
      percentage = parseFloat(((effectivePresent / totalWorkingDays) * 100).toFixed(2));
    }

    // Status classification: >= 75% Eligible, 65-74% Condonation, < 65% Shortage
    let eligibilityStatus = 'Eligible';
    let statusClass = 'status-eligible';

    if (totalWorkingDays > 0) {
      if (percentage < 65) {
        eligibilityStatus = 'Critical Shortage';
        statusClass = 'status-critical';
      } else if (percentage < 75) {
        eligibilityStatus = 'Condonation Required';
        statusClass = 'status-condonation';
      }
    }

    res.json({
      success: true,
      data: {
        regNo: student.regNo,
        studentName: student.name,
        department: student.department,
        semester: student.semester,
        fromDate: fromDate || (records.length > 0 ? records[0].date : 'N/A'),
        toDate: toDate || (records.length > 0 ? records[records.length - 1].date : 'N/A'),
        totalWorkingDays,
        presentDays,
        absentDays,
        onDutyDays,
        leaveDays,
        effectivePresent,
        percentage,
        eligibilityStatus,
        statusClass,
        records
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mark / update daily attendance in MongoDB
app.post('/api/attendance/mark', async (req, res) => {
  try {
    const { regNo, date, status, remarks } = req.body;
    if (!regNo || !date || !status) {
      return res.status(400).json({ success: false, error: 'regNo, date, and status are required.' });
    }

    const uppercaseReg = regNo.trim().toUpperCase();

    const record = await Attendance.findOneAndUpdate(
      { studentRegNo: uppercaseReg, date },
      { studentRegNo: uppercaseReg, date, status, remarks: remarks || '' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Re-seed Database endpoint
app.post('/api/seed', async (req, res) => {
  try {
    const result = await seedDatabase(MONGO_URI);
    res.json({ success: true, message: 'Database re-seeded successfully', result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback index.html for SPA
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Attendance Calculator Server running at http://localhost:${PORT}`);
});
