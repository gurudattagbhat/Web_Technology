const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/gurus_hospital';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

function requireDatabase(res) {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({ message: 'MongoDB is not connected. Make sure MongoDB is running and the database URL is valid.' });
    return false;
  }

  return true;
}

function getAuthModel(role) {
  return role === 'patient' ? Patient : Doctor;
}

function buildIdentifier(role) {
  const prefix = role === 'patient' ? 'PAT' : 'DOC';
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();

  return `${prefix}-${datePart}-${randomPart}`;
}

async function createUniqueIdentifier(role, Model) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const identifier = buildIdentifier(role);
    const existing = await Model.findOne({ identifier });

    if (!existing) {
      return identifier;
    }
  }

  throw new Error('Unable to generate a unique identifier. Please try again.');
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'hospital-management-system', database: mongoose.connection.name || null });
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    if (!requireDatabase(res)) {
      return;
    }

    console.log('signup handler reached');

    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'fullName, email, password, and role are required.' });
    }

    if (!['patient', 'doctor'].includes(role)) {
      return res.status(400).json({ message: 'Role must be patient or doctor.' });
    }

    const Model = getAuthModel(role);
    const normalizedEmail = email.toLowerCase();
    const existingUser = await Model.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const identifier = await createUniqueIdentifier(role, Model);

    const user = await Model.create({
      fullName,
      email: normalizedEmail,
      identifier,
      passwordHash,
    });

    return res.status(201).json({
      message: 'Account created successfully.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role,
        identifier: user.identifier,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Signup failed.', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    if (!requireDatabase(res)) {
      return;
    }

    console.log('login handler reached');

    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'email, password, and role are required.' });
    }

    if (!['patient', 'doctor'].includes(role)) {
      return res.status(400).json({ message: 'Role must be patient or doctor.' });
    }

    const Model = getAuthModel(role);
    const normalizedEmail = email.toLowerCase();
    const user = await Model.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email, password, or role.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email, password, or role.' });
    }

    return res.json({
      message: 'Login successful.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role,
        identifier: user.identifier,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed.', error: error.message });
  }
});

const Appointment = require('./models/Appointment');
const Prescription = require('./models/Prescription');

// Memory fallbacks in case MongoDB is unavailable
let memoryAppointments = [
  {
    _id: 'apt-101',
    patientName: 'Rohan Sharma',
    patientEmail: 'rohan.sharma@example.com',
    doctorEmail: 'doctor@gurushospital.com',
    doctorName: 'Dr. Rajesh Sharma',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM - 10:30 AM',
    reason: 'Routine Cardiac Checkup & Chest Discomfort',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'apt-102',
    patientName: 'Priya Nair',
    patientEmail: 'priya.nair@example.com',
    doctorEmail: 'doctor@gurushospital.com',
    doctorName: 'Dr. Rajesh Sharma',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '11:30 AM - 12:00 PM',
    reason: 'Hypertension Follow-up & BP Monitoring',
    status: 'accepted',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'apt-103',
    patientName: 'Amitabh Gupta',
    patientEmail: 'amitabh.g@example.com',
    doctorEmail: 'doctor@gurushospital.com',
    doctorName: 'Dr. Rajesh Sharma',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '02:00 PM - 02:30 PM',
    reason: 'ECG Review & General Consultation',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
];

let memoryPrescriptions = [
  {
    _id: 'presc-1',
    patientName: 'Priya Nair',
    patientEmail: 'priya.nair@example.com',
    doctorEmail: 'doctor@gurushospital.com',
    doctorName: 'Dr. Rajesh Sharma',
    diagnosis: 'Mild Essential Hypertension',
    medicines: [
      { name: 'Amlodipine 5mg', dosage: '1 tablet', frequency: 'Once daily (Morning)', duration: '30 days' },
      { name: 'Telmisartan 40mg', dosage: '1 tablet', frequency: 'Once daily (Night)', duration: '30 days' },
    ],
    notes: 'Reduce salt intake. Walk 30 minutes daily. Follow up in 4 weeks.',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'presc-2',
    patientName: 'Rohan Sharma',
    patientEmail: 'rohan.sharma@example.com',
    doctorEmail: 'doctor@gurushospital.com',
    doctorName: 'Dr. Rajesh Sharma',
    diagnosis: 'Cardiovascular Risk & Mild Angina',
    medicines: [
      { name: 'Atorvastatin 20mg', dosage: '1 tablet', frequency: 'Once daily (Night)', duration: '60 days' },
      { name: 'Aspirin 75mg', dosage: '1 tablet', frequency: 'Once daily (After lunch)', duration: '60 days' },
    ],
    notes: 'Routine ECG scheduled in 2 weeks. Maintain low sodium diet.',
    createdAt: new Date().toISOString(),
  },
];

let memoryPatients = [
  { _id: 'p1', fullName: 'Rohan Sharma', email: 'rohan.sharma@example.com', identifier: 'PAT-260810-A1B2', age: 34, gender: 'Male', phone: '+91 98765 11111', bloodGroup: 'O+', medicalHistory: 'Hypertension & Mild Angina' },
  { _id: 'p2', fullName: 'Priya Nair', email: 'priya.nair@example.com', identifier: 'PAT-260810-C3D4', age: 29, gender: 'Female', phone: '+91 98765 22222', bloodGroup: 'A+', medicalHistory: 'Migraine' },
  { _id: 'p3', fullName: 'Amitabh Gupta', email: 'amitabh.g@example.com', identifier: 'PAT-260810-E5F6', age: 48, gender: 'Male', phone: '+91 98765 33333', bloodGroup: 'B+', medicalHistory: 'Type 2 Diabetes' },
];

// Helper to seed initial appointments if DB is connected but empty
async function seedInitialData() {
  if (mongoose.connection.readyState === 1) {
    try {
      const count = await Appointment.countDocuments();
      if (count === 0) {
        await Appointment.insertMany(memoryAppointments);
        console.log('Seeded demo appointments into MongoDB');
      }
      const prescCount = await Prescription.countDocuments();
      if (prescCount === 0) {
        await Prescription.insertMany(memoryPrescriptions);
        console.log('Seeded demo prescriptions into MongoDB');
      }
    } catch (err) {
      console.warn('Seeding skipped:', err.message);
    }
  }
}

// ----------------------------------------------------
// DOCTOR DIRECTORY ENDPOINT
// ----------------------------------------------------
app.get('/api/doctors', async (req, res) => {
  const defaultDoctors = [
    { id: 'doc-1', fullName: 'Dr. Rajesh Sharma', email: 'doctor@gurushospital.com', department: 'Cardiology', qualification: 'MD Cardiology', experience: '14+ Years', rating: 4.9, image: 'RS' },
    { id: 'doc-2', fullName: 'Dr. Ananya Patel', email: 'ananya.patel@gurushospital.com', department: 'Neurology', qualification: 'DM Neurology', experience: '11+ Years', rating: 4.9, image: 'AP' },
    { id: 'doc-3', fullName: 'Dr. Vikram Malhotra', email: 'vikram.m@gurushospital.com', department: 'Orthopedics', qualification: 'MS Ortho', experience: '16+ Years', rating: 4.8, image: 'VM' },
    { id: 'doc-4', fullName: 'Dr. Sunita Deshmukh', email: 'sunita.d@gurushospital.com', department: 'Pediatrics', qualification: 'MD Pediatrics', experience: '9+ Years', rating: 4.9, image: 'SD' },
    { id: 'doc-5', fullName: 'Dr. Aris Thorne', email: 'aris.t@gurushospital.com', department: 'General Medicine', qualification: 'MBBS, MD', experience: '12+ Years', rating: 4.7, image: 'AT' },
    { id: 'doc-6', fullName: 'Dr. Meera Iyer', email: 'meera.i@gurushospital.com', department: 'Dermatology', qualification: 'MD Dermatology', experience: '8+ Years', rating: 4.8, image: 'MI' },
  ];

  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const dbDocs = await Doctor.find({}).select('-passwordHash');
        if (dbDocs && dbDocs.length > 0) {
          const merged = dbDocs.map((d) => {
            const docEmail = (d.email || '').toLowerCase();
            const docName = d.fullName || 'Doctor';
            const match = defaultDoctors.find((def) => def.email.toLowerCase() === docEmail) || {};
            const initials = docName.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'DR';
            return {
              id: d._id,
              fullName: docName,
              email: d.email || 'doctor@gurushospital.com',
              identifier: d.identifier || 'DOC-001',
              department: match.department || 'General Medicine',
              qualification: match.qualification || 'MD / Specialist',
              experience: match.experience || '10+ Years',
              rating: match.rating || 4.8,
              image: initials,
            };
          });

          defaultDoctors.forEach((def) => {
            if (!merged.some((m) => (m.email || '').toLowerCase() === def.email.toLowerCase())) {
              merged.push(def);
            }
          });

          return res.json({ doctors: merged });
        }
      } catch (dbErr) {
        console.warn('MongoDB query for doctors failed:', dbErr.message);
      }
    }

    return res.json({ doctors: defaultDoctors });
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    return res.json({ doctors: defaultDoctors });
  }
});

// ----------------------------------------------------
// APPOINTMENT ENDPOINTS
// ----------------------------------------------------
app.get('/api/appointments', async (req, res) => {
  try {
    const { doctorEmail, patientEmail, status } = req.query;
    if (mongoose.connection.readyState === 1) {
      await seedInitialData();
      const filter = {};
      if (doctorEmail) filter.doctorEmail = doctorEmail.toLowerCase();
      if (patientEmail) filter.patientEmail = patientEmail.toLowerCase();
      if (status && status !== 'all') filter.status = status;

      const appointments = await Appointment.find(filter).sort({ createdAt: -1 });
      return res.json({ appointments });
    }

    let result = memoryAppointments;
    if (doctorEmail) {
      result = result.filter((a) => a.doctorEmail.toLowerCase() === doctorEmail.toLowerCase());
    }
    if (patientEmail) {
      result = result.filter((a) => a.patientEmail.toLowerCase() === patientEmail.toLowerCase());
    }
    if (status && status !== 'all') {
      result = result.filter((a) => a.status === status);
    }
    return res.json({ appointments: result });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const { patientName, patientEmail, doctorEmail, doctorName, date, timeSlot, reason } = req.body;
    if (!patientName || !patientEmail || !date || !timeSlot) {
      return res.status(400).json({ message: 'patientName, patientEmail, date, and timeSlot are required.' });
    }

    if (mongoose.connection.readyState === 1) {
      const newApt = await Appointment.create({
        patientName,
        patientEmail: patientEmail.toLowerCase(),
        doctorEmail: doctorEmail ? doctorEmail.toLowerCase() : 'doctor@gurushospital.com',
        doctorName: doctorName || 'Dr. On Duty',
        date,
        timeSlot,
        reason: reason || 'General Checkup',
        status: 'pending',
      });
      return res.status(201).json({ message: 'Appointment booked successfully.', appointment: newApt });
    }

    const memoryApt = {
      _id: `apt-${Date.now()}`,
      patientName,
      patientEmail: patientEmail.toLowerCase(),
      doctorEmail: doctorEmail ? doctorEmail.toLowerCase() : 'doctor@gurushospital.com',
      doctorName: doctorName || 'Dr. On Duty',
      date,
      timeSlot,
      reason: reason || 'General Checkup',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    memoryAppointments.unshift(memoryApt);
    return res.status(201).json({ message: 'Appointment booked successfully.', appointment: memoryApt });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create appointment', error: error.message });
  }
});

app.patch('/api/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'accepted', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    if (mongoose.connection.readyState === 1) {
      const updated = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
      if (!updated) {
        return res.status(404).json({ message: 'Appointment not found.' });
      }
      return res.json({ message: `Appointment status updated to ${status}.`, appointment: updated });
    }

    const found = memoryAppointments.find((a) => a._id === id);
    if (found) {
      found.status = status;
      return res.json({ message: `Appointment status updated to ${status}.`, appointment: found });
    }
    return res.status(404).json({ message: 'Appointment not found.' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update appointment status', error: error.message });
  }
});

// ----------------------------------------------------
// PATIENT MANAGEMENT ENDPOINTS
// ----------------------------------------------------
app.get('/api/patients', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const patients = await Patient.find({}).select('-passwordHash').sort({ createdAt: -1 });
      return res.json({ patients });
    }

    return res.json({ patients: memoryPatients });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch patients', error: error.message });
  }
});

app.get('/api/patients/profile', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required.' });
    }

    const normalizedEmail = email.toLowerCase();
    if (mongoose.connection.readyState === 1) {
      const patient = await Patient.findOne({ email: normalizedEmail }).select('-passwordHash');
      if (patient) {
        return res.json({ patient });
      }
    }

    let found = memoryPatients.find((p) => p.email.toLowerCase() === normalizedEmail);
    if (found) {
      return res.json({ patient: found });
    }

    return res.json({
      patient: {
        fullName: req.query.name || 'Patient User',
        email: normalizedEmail,
        identifier: buildIdentifier('patient'),
        age: 30,
        gender: 'Not specified',
        phone: '+91 98765 00000',
        bloodGroup: 'O+',
        medicalHistory: 'None reported',
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch patient profile', error: error.message });
  }
});

app.patch('/api/patients/profile', async (req, res) => {
  try {
    const { email, fullName, age, gender, phone, bloodGroup, medicalHistory } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Patient email is required.' });
    }

    const normalizedEmail = email.toLowerCase();
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (age !== undefined && age !== '') updateData.age = Number(age);
    if (gender) updateData.gender = gender;
    if (phone) updateData.phone = phone;
    if (bloodGroup) updateData.bloodGroup = bloodGroup;
    if (medicalHistory !== undefined) updateData.medicalHistory = medicalHistory;

    if (mongoose.connection.readyState === 1) {
      const updated = await Patient.findOneAndUpdate({ email: normalizedEmail }, updateData, { new: true }).select('-passwordHash');
      if (updated) {
        return res.json({ message: 'Profile updated successfully.', patient: updated });
      }
    }

    let found = memoryPatients.find((p) => p.email.toLowerCase() === normalizedEmail);
    if (found) {
      Object.assign(found, updateData);
      return res.json({ message: 'Profile updated successfully.', patient: found });
    }

    const newMemoryPatient = {
      _id: `p-${Date.now()}`,
      fullName: fullName || 'Patient User',
      email: normalizedEmail,
      identifier: buildIdentifier('patient'),
      age: age ? Number(age) : 30,
      gender: gender || 'Not specified',
      phone: phone || '',
      bloodGroup: bloodGroup || 'O+',
      medicalHistory: medicalHistory || 'None',
    };
    memoryPatients.push(newMemoryPatient);
    return res.json({ message: 'Profile updated successfully.', patient: newMemoryPatient });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update patient profile', error: error.message });
  }
});

// ----------------------------------------------------
// DOCTOR PROFILE ENDPOINTS
// ----------------------------------------------------
app.get('/api/doctors/profile', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required.' });
    }

    const normalizedEmail = email.toLowerCase();
    if (mongoose.connection.readyState === 1) {
      const doctor = await Doctor.findOne({ email: normalizedEmail }).select('-passwordHash');
      if (doctor) {
        return res.json({ doctor });
      }
    }

    return res.json({
      doctor: {
        fullName: req.query.name || 'Dr. Rajesh Sharma',
        email: normalizedEmail,
        identifier: buildIdentifier('doctor'),
        age: 42,
        gender: 'Male',
        phone: '+91 98765 43210',
        department: 'Cardiology',
        qualification: 'MD, DM Cardiology (AIIMS)',
        experience: '14+ Years',
        opdRoom: 'Room 102, Cardiology Wing Floor 1',
        opdHours: 'Mon - Sat: 9:00 AM - 4:00 PM',
        consultationFee: 800,
        bio: 'Senior Interventional Cardiologist specializing in echocardiography, cardiac catheterization, and preventive cardiology.',
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch doctor profile', error: error.message });
  }
});

app.patch('/api/doctors/profile', async (req, res) => {
  try {
    const { email, fullName, newPassword, age, gender, phone, department, qualification, experience, opdRoom, opdHours, consultationFee, bio } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Doctor email is required.' });
    }

    const normalizedEmail = email.toLowerCase();
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (age !== undefined && age !== '') updateData.age = Number(age);
    if (gender) updateData.gender = gender;
    if (phone !== undefined) updateData.phone = phone;
    if (department) updateData.department = department;
    if (qualification) updateData.qualification = qualification;
    if (experience) updateData.experience = experience;
    if (opdRoom) updateData.opdRoom = opdRoom;
    if (opdHours) updateData.opdHours = opdHours;
    if (consultationFee !== undefined && consultationFee !== '') updateData.consultationFee = Number(consultationFee);
    if (bio !== undefined) updateData.bio = bio;

    if (newPassword && newPassword.trim() !== '') {
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    if (mongoose.connection.readyState === 1) {
      const updated = await Doctor.findOneAndUpdate({ email: normalizedEmail }, updateData, { new: true }).select('-passwordHash');
      if (updated) {
        return res.json({ message: 'Doctor profile updated successfully.', doctor: updated });
      }
    }

    const fallbackDoc = {
      fullName: fullName || 'Dr. Rajesh Sharma',
      email: normalizedEmail,
      identifier: buildIdentifier('doctor'),
      age: age ? Number(age) : 42,
      gender: gender || 'Male',
      phone: phone || '+91 98765 43210',
      department: department || 'Cardiology',
      qualification: qualification || 'MD, DM Cardiology (AIIMS)',
      experience: experience || '14+ Years',
      opdRoom: opdRoom || 'Room 102, Cardiology Wing Floor 1',
      opdHours: opdHours || 'Mon - Sat: 9:00 AM - 4:00 PM',
      consultationFee: consultationFee ? Number(consultationFee) : 800,
      bio: bio || 'Senior Interventional Cardiologist.',
    };

    return res.json({ message: 'Doctor profile updated successfully.', doctor: fallbackDoc });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update doctor profile', error: error.message });
  }
});

app.post('/api/patients/quick-add', async (req, res) => {
  try {
    const { fullName, email, password, age, gender, phone, bloodGroup, medicalHistory } = req.body;
    if (!fullName || !email) {
      return res.status(400).json({ message: 'fullName and email are required.' });
    }

    const normalizedEmail = email.toLowerCase();
    const defaultPassword = password || 'Patient@123';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    if (mongoose.connection.readyState === 1) {
      const existing = await Patient.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(409).json({ message: 'A patient with this email already exists.' });
      }

      const identifier = await createUniqueIdentifier('patient', Patient);
      const newPatient = await Patient.create({
        fullName,
        email: normalizedEmail,
        passwordHash,
        identifier,
        age: age ? Number(age) : undefined,
        gender: gender || 'Not specified',
        phone: phone || '',
        bloodGroup: bloodGroup || 'A+',
        medicalHistory: medicalHistory || 'None',
      });

      return res.status(201).json({
        message: 'Patient registered successfully.',
        patient: {
          id: newPatient._id,
          fullName: newPatient.fullName,
          email: newPatient.email,
          identifier: newPatient.identifier,
          age: newPatient.age,
          gender: newPatient.gender,
          phone: newPatient.phone,
          bloodGroup: newPatient.bloodGroup,
          medicalHistory: newPatient.medicalHistory,
        },
      });
    }

    const identifier = buildIdentifier('patient');
    const memoryPatient = {
      _id: `p-${Date.now()}`,
      fullName,
      email: normalizedEmail,
      identifier,
      age: age ? Number(age) : 30,
      gender: gender || 'Not specified',
      phone: phone || '+91 98765 00000',
      bloodGroup: bloodGroup || 'O+',
      medicalHistory: medicalHistory || 'None',
    };
    return res.status(201).json({ message: 'Patient registered successfully.', patient: memoryPatient });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to register patient', error: error.message });
  }
});

// ----------------------------------------------------
// PRESCRIPTION ENDPOINTS
// ----------------------------------------------------
app.get('/api/prescriptions', async (req, res) => {
  try {
    const { doctorEmail, patientEmail } = req.query;
    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (doctorEmail) filter.doctorEmail = doctorEmail.toLowerCase();
      if (patientEmail) filter.patientEmail = patientEmail.toLowerCase();

      const prescriptions = await Prescription.find(filter).sort({ createdAt: -1 });
      return res.json({ prescriptions });
    }

    let result = memoryPrescriptions;
    if (doctorEmail) {
      result = result.filter((p) => p.doctorEmail.toLowerCase() === doctorEmail.toLowerCase());
    }
    if (patientEmail) {
      result = result.filter((p) => p.patientEmail.toLowerCase() === patientEmail.toLowerCase());
    }
    return res.json({ prescriptions: result });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch prescriptions', error: error.message });
  }
});

app.post('/api/prescriptions', async (req, res) => {
  try {
    const { patientName, patientEmail, doctorEmail, doctorName, diagnosis, medicines, notes } = req.body;
    if (!patientName || !patientEmail || !diagnosis || !medicines || !medicines.length) {
      return res.status(400).json({ message: 'patientName, patientEmail, diagnosis, and at least one medicine are required.' });
    }

    if (mongoose.connection.readyState === 1) {
      const newPrescription = await Prescription.create({
        patientName,
        patientEmail: patientEmail.toLowerCase(),
        doctorEmail: doctorEmail ? doctorEmail.toLowerCase() : 'doctor@gurushospital.com',
        doctorName: doctorName || 'Dr. On Duty',
        diagnosis,
        medicines,
        notes: notes || '',
      });

      return res.status(201).json({ message: 'Prescription generated successfully.', prescription: newPrescription });
    }

    const memoryPrescription = {
      _id: `presc-${Date.now()}`,
      patientName,
      patientEmail: patientEmail.toLowerCase(),
      doctorEmail: doctorEmail ? doctorEmail.toLowerCase() : 'doctor@gurushospital.com',
      doctorName: doctorName || 'Dr. On Duty',
      diagnosis,
      medicines,
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };
    memoryPrescriptions.unshift(memoryPrescription);
    return res.status(201).json({ message: 'Prescription generated successfully.', prescription: memoryPrescription });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create prescription', error: error.message });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function start() {
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
      console.log('Starting server without database connection. Make sure MongoDB is running and the database URL is valid.');
    }
  } else {
    console.log('MONGODB_URI not set, starting without database connection');
  }

  app.listen(port, () => {
    console.log(`Hospital management system running on http://localhost:${port}`);
  });
}

start();