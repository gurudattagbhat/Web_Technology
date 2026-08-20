const mongoose = require('mongoose');
const Student = require('./models/Student');
const Attendance = require('./models/Attendance');

const sampleStudents = [
  { regNo: '24MCA001', name: 'Aarav Sharma', department: 'Master of Computer Applications', semester: 'Sem II', email: 'aarav.sharma@univ.edu' },
  { regNo: '24MCA002', name: 'Ananya Patel', department: 'Master of Computer Applications', semester: 'Sem II', email: 'ananya.p@univ.edu' },
  { regNo: '24MCA003', name: 'Rohan Verma', department: 'Master of Computer Applications', semester: 'Sem II', email: 'rohan.v@univ.edu' },
  { regNo: '24MCA004', name: 'Diya Sengupta', department: 'Master of Computer Applications', semester: 'Sem II', email: 'diya.s@univ.edu' },
  { regNo: '24MCA005', name: 'Vikramaditya Rao', department: 'Master of Computer Applications', semester: 'Sem II', email: 'vikram.rao@univ.edu' },
  { regNo: '24MCA006', name: 'Kavya Nair', department: 'Master of Computer Applications', semester: 'Sem II', email: 'kavya.n@univ.edu' }
];

// Helper to generate dates between start and end (excluding weekends)
function generateWorkingDates(startDateStr, endDateStr) {
  const dates = [];
  let curr = new Date(startDateStr);
  const end = new Date(endDateStr);

  while (curr <= end) {
    const dayOfWeek = curr.getDay();
    // 0 = Sun, 6 = Sat -> only Monday to Friday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const year = curr.getFullYear();
      const month = String(curr.getMonth() + 1).padStart(2, '0');
      const day = String(curr.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
}

// Pseudo-random attendance status based on student seed
function getStatusForStudent(studentIndex, dateIndex) {
  const seed = (studentIndex * 17 + dateIndex * 31) % 100;
  // Make different students have different attendance rates:
  // Student 0 (Aarav): ~92% present
  // Student 1 (Ananya): ~85% present
  // Student 2 (Rohan): ~71% present (Shortage alert!)
  // Student 3 (Diya): ~96% present
  // Student 4 (Vikram): ~62% present (Critical shortage)
  // Student 5 (Kavya): ~88% present
  
  if (studentIndex === 0) {
    if (seed > 92) return 'Absent';
    if (seed > 88) return 'On-Duty';
    return 'Present';
  } else if (studentIndex === 1) {
    if (seed > 85) return 'Absent';
    if (seed > 80) return 'Leave';
    return 'Present';
  } else if (studentIndex === 2) {
    if (seed > 71) return 'Absent';
    if (seed > 65) return 'Leave';
    return 'Present';
  } else if (studentIndex === 3) {
    if (seed > 96) return 'Absent';
    return 'Present';
  } else if (studentIndex === 4) {
    if (seed > 62) return 'Absent';
    if (seed > 55) return 'Leave';
    return 'Present';
  } else {
    if (seed > 88) return 'Absent';
    if (seed > 84) return 'On-Duty';
    return 'Present';
  }
}

async function seedDatabase(uri = 'mongodb://127.0.0.1:27017/attendance_db') {
  let isStandalone = false;
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
    isStandalone = true;
  }

  console.log('🌱 Seeding MongoDB attendance_db...');

  // Clear existing collections
  await Student.deleteMany({});
  await Attendance.deleteMany({});

  // Insert students
  const insertedStudents = await Student.insertMany(sampleStudents);
  console.log(`✅ Seeded ${insertedStudents.length} students into MongoDB.`);

  // Generate working dates from 2026-06-01 to 2026-08-17
  const dates = generateWorkingDates('2026-06-01', '2026-08-17');
  console.log(`📅 Generated ${dates.length} working days for attendance generation.`);

  const attendanceRecords = [];

  insertedStudents.forEach((student, studentIndex) => {
    dates.forEach((dateStr, dateIndex) => {
      const status = getStatusForStudent(studentIndex, dateIndex);
      attendanceRecords.push({
        studentRegNo: student.regNo,
        date: dateStr,
        status: status,
        remarks: status === 'Absent' ? 'Unexcused' : status === 'On-Duty' ? 'Tech Fest' : ''
      });
    });
  });

  await Attendance.insertMany(attendanceRecords);
  console.log(`✅ Seeded ${attendanceRecords.length} daily attendance records into MongoDB.`);

  if (isStandalone) {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB seeder.');
  }

  return { studentsCount: insertedStudents.length, recordsCount: attendanceRecords.length };
}

if (require.main === module) {
  seedDatabase().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
}

module.exports = seedDatabase;
