/**
 * ATTENDANCE PORTAL & CALCULATOR FRONTEND ENGINE
 * Connects directly with MongoDB Express backend API
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- TAB NAVIGATION ---
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      navTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(targetTab).classList.add('active');

      if (targetTab === 'tab-take-attendance') {
        loadAttendanceSheet();
      } else if (targetTab === 'tab-manage-students') {
        renderStudentDirectory();
      }
    });
  });

  // --- DOM REFERENCES ---
  const dbStatusBadge = document.getElementById('dbStatusBadge');
  const dbStatusText = document.getElementById('dbStatusText');
  const studentSelect = document.getElementById('studentSelect');
  const regNoInput = document.getElementById('regNoInput');
  const studentNameInput = document.getElementById('studentNameInput');
  const fromDateInput = document.getElementById('fromDateInput');
  const toDateInput = document.getElementById('toDateInput');
  const attendanceForm = document.getElementById('attendanceForm');
  const btnCalculate = document.getElementById('btnCalculate');
  const btnSeedData = document.getElementById('btnSeedData');

  // DOM Calculator Output references
  const placeholderView = document.getElementById('placeholderView');
  const resultsContent = document.getElementById('resultsContent');
  const domStudentName = document.getElementById('domStudentName');
  const domRegNo = document.getElementById('domRegNo');
  const domDepartment = document.getElementById('domDepartment');
  const domDateRange = document.getElementById('domDateRange');
  const domPercentage = document.getElementById('domPercentage');
  const gaugeCircle = document.getElementById('gaugeCircle');
  const badgeEligibility = document.getElementById('badgeEligibility');

  const domWorkingDays = document.getElementById('domWorkingDays');
  const domPresentDays = document.getElementById('domPresentDays');
  const domAbsentDays = document.getElementById('domAbsentDays');
  const domOnDutyDays = document.getElementById('domOnDutyDays');
  const domTableBody = document.getElementById('domTableBody');
  const studentAvatar = document.getElementById('studentAvatar');
  const btnToggleTable = document.getElementById('btnToggleTable');
  const tableWrapper = document.getElementById('tableWrapper');

  // Take Attendance References
  const takeAttendanceDate = document.getElementById('takeAttendanceDate');
  const takeAttendanceTableBody = document.getElementById('takeAttendanceTableBody');
  const btnMarkAllPresent = document.getElementById('btnMarkAllPresent');
  const btnMarkAllAbsent = document.getElementById('btnMarkAllAbsent');
  const btnSaveAttendanceSheet = document.getElementById('btnSaveAttendanceSheet');

  // Student Management References
  const studentDirectoryTableBody = document.getElementById('studentDirectoryTableBody');
  const btnOpenAddStudent = document.getElementById('btnOpenAddStudent');

  // Modal References
  const studentModal = document.getElementById('studentModal');
  const modalTitle = document.getElementById('modalTitle');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const studentForm = document.getElementById('studentForm');

  const deleteModal = document.getElementById('deleteModal');
  const btnCloseDeleteModal = document.getElementById('btnCloseDeleteModal');
  const btnCancelDelete = document.getElementById('btnCancelDelete');
  const btnConfirmDelete = document.getElementById('btnConfirmDelete');
  const deleteStudentName = document.getElementById('deleteStudentName');
  const deleteRegNo = document.getElementById('deleteRegNo');

  // App State
  let loadedStudents = [];
  let currentSheetData = [];
  let studentToDelete = null;

  // --- INITIALIZATION ---
  checkDatabaseStatus();
  fetchStudents();

  // Polling DB Connection status every 10s
  setInterval(checkDatabaseStatus, 10000);

  // --- EVENT LISTENERS: CALCULATOR TAB ---

  // Student Select Change -> Auto fill RegNo and Student Name
  studentSelect.addEventListener('change', (e) => {
    const selectedReg = e.target.value;
    if (!selectedReg) return;
    
    const student = loadedStudents.find(s => s.regNo === selectedReg);
    if (student) {
      regNoInput.value = student.regNo;
      studentNameInput.value = student.name;
      calculateAttendance();
    }
  });

  // Manual RegNo input -> auto lookup
  regNoInput.addEventListener('input', (e) => {
    const typed = e.target.value.trim().toUpperCase();
    const student = loadedStudents.find(s => s.regNo === typed);
    if (student) {
      studentNameInput.value = student.name;
      studentSelect.value = student.regNo;
    } else {
      studentNameInput.value = typed ? 'Custom / Not in Preset' : '';
    }
  });

  // Quick Date Presets
  document.querySelectorAll('.preset-chips .chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      document.querySelectorAll('.preset-chips .chip').forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      const preset = e.target.getAttribute('data-preset');

      if (preset === 'all') {
        fromDateInput.value = '2026-06-01';
        toDateInput.value = '2026-08-17';
      } else if (preset === 'july') {
        fromDateInput.value = '2026-07-01';
        toDateInput.value = '2026-07-31';
      } else if (preset === 'august') {
        fromDateInput.value = '2026-08-01';
        toDateInput.value = '2026-08-17';
      }

      if (regNoInput.value.trim()) {
        calculateAttendance();
      }
    });
  });

  // Calculate Button Click ("Percentage Button")
  attendanceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateAttendance();
  });

  // Seed Data Button
  btnSeedData.addEventListener('click', async () => {
    btnSeedData.disabled = true;
    btnSeedData.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Seeding Mongo...';
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast('MongoDB database re-seeded successfully!', 'success');
        await fetchStudents();
        if (regNoInput.value.trim()) {
          calculateAttendance();
        }
      } else {
        showToast('Seeding failed: ' + data.error, 'error');
      }
    } catch (err) {
      showToast('Error connecting to backend server', 'error');
    } finally {
      btnSeedData.disabled = false;
      btnSeedData.innerHTML = '<i class="ri-refresh-line"></i> Seed DB Data';
    }
  });

  // Toggle Table Expand
  btnToggleTable.addEventListener('click', () => {
    tableWrapper.classList.toggle('expanded');
    const isExpanded = tableWrapper.classList.contains('expanded');
    btnToggleTable.innerHTML = isExpanded 
      ? '<i class="ri-arrow-up-s-line"></i> Collapse Details' 
      : '<i class="ri-arrow-down-s-line"></i> Expand Details';
  });

  // --- EVENT LISTENERS: TAKE ATTENDANCE TAB ---
  takeAttendanceDate.addEventListener('change', () => {
    loadAttendanceSheet();
  });

  btnMarkAllPresent.addEventListener('click', () => {
    currentSheetData.forEach(item => item.status = 'Present');
    renderAttendanceSheet();
  });

  btnMarkAllAbsent.addEventListener('click', () => {
    currentSheetData.forEach(item => item.status = 'Absent');
    renderAttendanceSheet();
  });

  btnSaveAttendanceSheet.addEventListener('click', async () => {
    const date = takeAttendanceDate.value;
    if (!date) {
      showToast('Please select a date.', 'error');
      return;
    }

    btnSaveAttendanceSheet.disabled = true;
    btnSaveAttendanceSheet.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Saving to MongoDB...';

    try {
      const res = await fetch('/api/attendance/bulk-mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, records: currentSheetData })
      });
      const data = await res.json();

      if (data.success) {
        showToast(`Class attendance for ${date} saved to MongoDB!`, 'success');
        // Refresh calculator if student selected
        if (regNoInput.value.trim()) {
          calculateAttendance();
        }
      } else {
        showToast(data.error, 'error');
      }
    } catch (err) {
      showToast('Failed to save attendance to MongoDB', 'error');
    } finally {
      btnSaveAttendanceSheet.disabled = false;
      btnSaveAttendanceSheet.innerHTML = '<i class="ri-save-3-line"></i> Save Class Attendance to MongoDB';
    }
  });


  // --- EVENT LISTENERS: STUDENT MANAGEMENT TAB ---

  btnOpenAddStudent.addEventListener('click', () => {
    document.getElementById('editOriginalRegNo').value = '';
    modalTitle.innerHTML = '<i class="ri-user-add-line"></i> Add Student to MongoDB';
    document.getElementById('modalRegNo').value = '';
    document.getElementById('modalRegNo').readOnly = false;
    document.getElementById('modalName').value = '';
    document.getElementById('modalDept').value = 'Master of Computer Applications';
    document.getElementById('modalSem').value = 'Sem II';
    document.getElementById('modalEmail').value = '';
    studentModal.classList.remove('hidden');
  });

  btnCloseModal.addEventListener('click', () => studentModal.classList.add('hidden'));
  btnCancelModal.addEventListener('click', () => studentModal.classList.add('hidden'));

  studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const originalReg = document.getElementById('editOriginalRegNo').value;
    const regNo = document.getElementById('modalRegNo').value.trim();
    const name = document.getElementById('modalName').value.trim();
    const department = document.getElementById('modalDept').value.trim();
    const semester = document.getElementById('modalSem').value.trim();
    const email = document.getElementById('modalEmail').value.trim();

    const isEdit = !!originalReg;
    const url = isEdit ? `/api/students/${originalReg}` : '/api/students';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo, name, department, semester, email })
      });
      const data = await res.json();

      if (data.success) {
        showToast(isEdit ? `Student ${regNo} updated in MongoDB!` : `Student ${regNo} saved to MongoDB!`, 'success');
        studentModal.classList.add('hidden');
        studentForm.reset();
        await fetchStudents();
        renderStudentDirectory();
      } else {
        showToast(data.error, 'error');
      }
    } catch (err) {
      showToast('Error saving student to MongoDB', 'error');
    }
  });

  // Delete Modal listeners
  btnCloseDeleteModal.addEventListener('click', () => deleteModal.classList.add('hidden'));
  btnCancelDelete.addEventListener('click', () => deleteModal.classList.add('hidden'));

  btnConfirmDelete.addEventListener('click', async () => {
    if (!studentToDelete) return;
    try {
      const res = await fetch(`/api/students/${studentToDelete}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`Student ${studentToDelete} removed from MongoDB!`, 'success');
        deleteModal.classList.add('hidden');
        studentToDelete = null;
        await fetchStudents();
        renderStudentDirectory();
        if (regNoInput.value.trim() === studentToDelete) {
          regNoInput.value = '';
          studentNameInput.value = '';
        }
      } else {
        showToast(data.error, 'error');
      }
    } catch (err) {
      showToast('Error removing student from MongoDB', 'error');
    }
  });


  // --- API & DOM FUNCTIONS ---

  // Check MongoDB Server Status
  async function checkDatabaseStatus() {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      if (data.mongoConnected) {
        dbStatusBadge.className = 'db-badge status-connected';
        dbStatusText.textContent = `MongoDB Connected (${data.databaseName})`;
      } else {
        dbStatusBadge.className = 'db-badge status-disconnected';
        dbStatusText.textContent = 'MongoDB Offline';
      }
    } catch (err) {
      dbStatusBadge.className = 'db-badge status-disconnected';
      dbStatusText.textContent = 'Server Offline';
    }
  }

  // Fetch Student List from MongoDB
  async function fetchStudents() {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.success) {
        loadedStudents = data.data;
        studentSelect.innerHTML = '<option value="">-- Select Student from MongoDB --</option>';
        loadedStudents.forEach(student => {
          const opt = document.createElement('option');
          opt.value = student.regNo;
          opt.textContent = `${student.regNo} - ${student.name}`;
          studentSelect.appendChild(opt);
        });

        // Default select first student if available
        if (loadedStudents.length > 0 && !regNoInput.value) {
          studentSelect.value = loadedStudents[0].regNo;
          regNoInput.value = loadedStudents[0].regNo;
          studentNameInput.value = loadedStudents[0].name;
          calculateAttendance();
        }
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  }

  // Calculate Attendance & Update DOM
  async function calculateAttendance() {
    const regNo = regNoInput.value.trim();
    const fromDate = fromDateInput.value;
    const toDate = toDateInput.value;

    if (!regNo) {
      showToast('Please enter or select a Student Register Number (RegNo).', 'error');
      return;
    }

    btnCalculate.disabled = true;
    btnCalculate.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> <span>Calculating...</span>';

    try {
      const res = await fetch('/api/attendance/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo, fromDate, toDate })
      });

      const result = await res.json();

      if (!result.success) {
        showToast(result.error, 'error');
        placeholderView.classList.remove('hidden');
        resultsContent.classList.add('hidden');
        return;
      }

      const data = result.data;
      renderDOMResults(data);

    } catch (err) {
      showToast('Error querying attendance from MongoDB database.', 'error');
    } finally {
      btnCalculate.disabled = false;
      btnCalculate.innerHTML = '<i class="ri-pie-chart-2-line"></i> <span>Percentage Button</span>';
    }
  }

  // Render Calculation Results directly onto the DOM
  function renderDOMResults(data) {
    placeholderView.classList.add('hidden');
    resultsContent.classList.remove('hidden');

    domStudentName.textContent = data.studentName;
    domRegNo.textContent = data.regNo;
    domDepartment.textContent = data.department || 'Master of Computer Applications';
    domDateRange.textContent = `${data.fromDate} to ${data.toDate}`;

    const nameParts = data.studentName.split(' ');
    const initials = nameParts.length >= 2 
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
      : nameParts[0].substring(0, 2).toUpperCase();
    studentAvatar.textContent = initials;

    domPercentage.textContent = `${data.percentage}%`;

    const circumference = 326.72;
    const offset = circumference - (data.percentage / 100) * circumference;
    gaugeCircle.style.strokeDashoffset = offset;

    badgeEligibility.textContent = data.eligibilityStatus;
    badgeEligibility.className = `badge badge-lg ${data.statusClass}`;

    if (data.percentage >= 75) {
      gaugeCircle.style.stroke = 'var(--success)';
    } else if (data.percentage >= 65) {
      gaugeCircle.style.stroke = 'var(--warning)';
    } else {
      gaugeCircle.style.stroke = 'var(--danger)';
    }

    domWorkingDays.textContent = data.totalWorkingDays;
    domPresentDays.textContent = data.presentDays;
    domAbsentDays.textContent = data.absentDays;
    domOnDutyDays.textContent = data.onDutyDays + data.leaveDays;

    domTableBody.innerHTML = '';

    if (data.records.length === 0) {
      domTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">No attendance records found in MongoDB for this date range.</td></tr>`;
      return;
    }

    data.records.forEach((record, index) => {
      const tr = document.createElement('tr');
      let pillClass = 'pill-present';
      let icon = 'ri-checkbox-circle-line';
      if (record.status === 'Absent') { pillClass = 'pill-absent'; icon = 'ri-close-circle-line'; }
      else if (record.status === 'On-Duty') { pillClass = 'pill-onduty'; icon = 'ri-briefcase-line'; }
      else if (record.status === 'Leave') { pillClass = 'pill-leave'; icon = 'ri-calendar-event-line'; }

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td><strong>${record.date}</strong></td>
        <td><span class="status-pill ${pillClass}"><i class="${icon}"></i> ${record.status}</span></td>
        <td>${record.remarks || '-'}</td>
      `;
      domTableBody.appendChild(tr);
    });
  }

  // Load Attendance Sheet for Date
  async function loadAttendanceSheet() {
    const date = takeAttendanceDate.value;
    if (!date) return;

    takeAttendanceTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Loading roster from MongoDB...</td></tr>`;

    try {
      const res = await fetch(`/api/attendance/date/${date}`);
      const data = await res.json();
      if (data.success) {
        currentSheetData = data.data;
        renderAttendanceSheet();
      }
    } catch (err) {
      showToast('Error loading class roster from MongoDB', 'error');
    }
  }

  // Render Attendance Sheet Table
  function renderAttendanceSheet() {
    takeAttendanceTableBody.innerHTML = '';
    if (currentSheetData.length === 0) {
      takeAttendanceTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">No students in MongoDB directory. Add students in 'Manage Students' tab first.</td></tr>`;
      return;
    }

    currentSheetData.forEach((item, index) => {
      const tr = document.createElement('tr');
      const statusOptions = ['Present', 'Absent', 'On-Duty', 'Leave'];

      let optionsHtml = '';
      statusOptions.forEach(opt => {
        const isSelected = item.status === opt;
        const colorClass = opt === 'Present' ? 'selected-present' 
          : opt === 'Absent' ? 'selected-absent' 
          : opt === 'On-Duty' ? 'selected-onduty' : 'selected-leave';

        optionsHtml += `
          <label class="status-radio-label ${isSelected ? colorClass : ''}">
            <input type="radio" name="status_${item.regNo}" value="${opt}" ${isSelected ? 'checked' : ''} />
            ${opt}
          </label>
        `;
      });

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td><strong>${item.regNo}</strong></td>
        <td>${item.name}</td>
        <td><div class="status-radio-group">${optionsHtml}</div></td>
        <td><input type="text" class="form-control form-control-inline sheet-remark" data-reg="${item.regNo}" value="${item.remarks || ''}" placeholder="Remark" style="padding-left:0.5rem;" /></td>
      `;

      // Radio button event listeners
      tr.querySelectorAll(`input[name="status_${item.regNo}"]`).forEach(radio => {
        radio.addEventListener('change', (e) => {
          item.status = e.target.value;
          renderAttendanceSheet();
        });
      });

      // Remark event listener
      const remarkInput = tr.querySelector('.sheet-remark');
      remarkInput.addEventListener('input', (e) => {
        item.remarks = e.target.value;
      });

      takeAttendanceTableBody.appendChild(tr);
    });
  }

  // Render Student Management Directory Table
  function renderStudentDirectory() {
    studentDirectoryTableBody.innerHTML = '';

    if (loadedStudents.length === 0) {
      studentDirectoryTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--text-muted);">No students found in MongoDB. Click '+ Add New Student' to create one.</td></tr>`;
      return;
    }

    loadedStudents.forEach((student, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td><strong>${student.regNo}</strong></td>
        <td>${student.name}</td>
        <td>${student.department || 'MCA'}</td>
        <td>${student.semester || 'Sem II'}</td>
        <td>${student.email || '-'}</td>
        <td style="text-align: right;">
          <button class="btn btn-xs btn-outline btn-edit-student" data-reg="${student.regNo}">
            <i class="ri-edit-line"></i> Edit
          </button>
          <button class="btn btn-xs btn-outline-danger btn-delete-student" data-reg="${student.regNo}" data-name="${student.name}">
            <i class="ri-delete-bin-line"></i> Remove
          </button>
        </td>
      `;

      // Edit click
      tr.querySelector('.btn-edit-student').addEventListener('click', () => {
        document.getElementById('editOriginalRegNo').value = student.regNo;
        modalTitle.innerHTML = `<i class="ri-edit-line"></i> Edit Student ${student.regNo}`;
        document.getElementById('modalRegNo').value = student.regNo;
        document.getElementById('modalRegNo').readOnly = true;
        document.getElementById('modalName').value = student.name;
        document.getElementById('modalDept').value = student.department || 'Master of Computer Applications';
        document.getElementById('modalSem').value = student.semester || 'Sem II';
        document.getElementById('modalEmail').value = student.email || '';
        studentModal.classList.remove('hidden');
      });

      // Delete click
      tr.querySelector('.btn-delete-student').addEventListener('click', () => {
        studentToDelete = student.regNo;
        deleteRegNo.textContent = student.regNo;
        deleteStudentName.textContent = student.name;
        deleteModal.classList.remove('hidden');
      });

      studentDirectoryTableBody.appendChild(tr);
    });
  }

  // Toast Notifications
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let icon = 'ri-information-line';
    if (type === 'success') icon = 'ri-checkbox-circle-line';
    if (type === 'error') icon = 'ri-error-warning-line';

    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

});
