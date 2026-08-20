/* Alliance University - Alliance ONE 2026 Vanilla JavaScript Engine */

// Dataset Models
const EVENT_TYPES = [
  { id: 'battle-of-bands', name: 'Battle of Bands & Pro-Night', category: 'Cultural', icon: '🎸', baseFee: 1200, multiplier: 1.5, teamType: 'Team (3-8 Members)', description: 'Rock out on the grand amphitheatre stage. Top bands battle for the ₹2,00,000 trophy.' },
  { id: 'hack-alliance', name: 'HackAlliance 24-Hour Hackathon', category: 'Technical', icon: '💻', baseFee: 800, multiplier: 1.2, teamType: 'Team (2-4 Members)', description: 'Overnight coding marathon to solve real-world AI, Web3 & FinTech challenges.' },
  { id: 'fashion-show', name: 'Vogue: National Fashion Show', category: 'Cultural', icon: '✨', baseFee: 1500, multiplier: 1.4, teamType: 'Team (6-15 Members)', description: 'High-fashion runway competition featuring theme-based couture and music sync.' },
  { id: 'esports', name: 'Esports Championship (Valorant & BGMI)', category: 'Gaming', icon: '🎮', baseFee: 600, multiplier: 1.0, teamType: 'Squad (4-5 Members)', description: 'LAN gaming showdown with live commentary, streaming, and pro gaming gear setups.' },
  { id: 'choreonite', name: 'Choreonite: Group Dance Battle', category: 'Cultural', icon: '🔥', baseFee: 1000, multiplier: 1.3, teamType: 'Group (8-20 Members)', description: 'High-octane synchronization, western & classical group dance championship.' },
  { id: 'robotics-workshop', name: 'AI & Autonomous Robotics Workshop', category: 'Workshops', icon: '🤖', baseFee: 500, multiplier: 1.1, teamType: 'Solo / Duo', description: 'Hands-on hardware & machine learning kit building session with industry experts.' }
];

const VENUES = [
  { id: 'central-quad', name: 'Central Amphitheatre & Quadrangle', location: 'Main Block, Alliance Campus', capacity: 3500, rent: 2500, rating: 4.95, image: './images/image1.webp', features: ['360 Sound Stage', 'LED Wall Backdrop', 'Pro Stage Lighting', 'Open-Air Seating'] },
  { id: 'main-auditorium', name: 'Alliance Grand Performing Auditorium', location: 'Academic Block B', capacity: 1200, rent: 2000, rating: 4.9, image: './images/images (2).jpeg', features: ['Central AC', 'Acoustic Wall Panels', 'Green Rooms', 'VIP Balcony'] },
  { id: 'tech-park-hall', name: 'Tech & Innovation Convention Hall', location: 'School of Advanced Computing', capacity: 600, rent: 1200, rating: 4.85, image: './images/images.jpeg', features: ['Gigabit Wi-Fi', 'Dual 4K Projectors', 'Power Outlets', 'Robotics Ring'] },
  { id: 'sports-complex', name: 'Alliance Athletic Complex & Arena', location: 'Sports Pavilion Grounds', capacity: 5000, rent: 3000, rating: 4.8, image: './images/download.jpeg', features: ['Floodlight Arena', 'Live Stream Control Room', 'LAN Rig Stations', 'Food Court Nearby'] }
];

const ADDONS = [
  { id: 'fest-tshirt', name: 'Official Alliance ONE 2026 Merchandise T-Shirt', price: 499 },
  { id: 'food-pass', name: 'All-Day Campus Food & Beverage VIP Pass', price: 350 },
  { id: 'vip-pronight', name: 'VIP Pro-Night Concert Front-Row Pass', price: 599 },
  { id: 'certificate-hardcopy', name: 'Laminated Hardcopy Certificate & Souvenir Kit', price: 200 }
];

// App State
let currentStep = 1;
let currentView = 'dashboard';
let activeBooking = null;

let bookings = JSON.parse(localStorage.getItem('alliance_one_bookings_v1')) || [
  {
    id: 'ALLIANCE-ONE-9821',
    customerName: 'Ananya Hegde',
    phone: '+91 98450 11223',
    email: 'ananya.h@student.alliance.edu.in',
    collegeName: 'Alliance School of Computer Science',
    rollNumber: '1AL24CS042',
    address: 'Alliance University Student Housing, Block C, Bengaluru',
    eventTypeName: 'HackAlliance 24-Hour Hackathon',
    venueName: 'Tech & Innovation Convention Hall',
    venueLocation: 'School of Advanced Computing',
    eventDate: '2026-10-24',
    startTime: '09:00',
    endTime: '18:00',
    guestCount: 4,
    selectedAddons: ['Official Alliance ONE 2026 Merchandise T-Shirt', 'All-Day Campus Food & Beverage VIP Pass'],
    baseFee: 800,
    multiplier: 1.2,
    memberSurcharge: 450,
    addonsTotal: 849,
    tax: 952,
    totalPrice: 6242,
    paymentMethod: 'online',
    transactionId: 'TXN-UPI-AL1-9821',
    bookingStatus: 'Confirmed'
  }
];

// Navigation View Switcher (Exposed globally)
window.showView = function(viewName, params = {}) {
  currentView = viewName;
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  
  const targetSec = document.getElementById(`${viewName}-view`);
  if (targetSec) {
    targetSec.classList.add('active');
  }

  if (params.eventType) {
    const sel = document.getElementById('event-type-select');
    if (sel) sel.value = params.eventType;
  }
  if (params.venueId) {
    const sel = document.getElementById('venue-select');
    if (sel) sel.value = params.venueId;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.updateBookingsCount = function() {
  const badge = document.getElementById('bookings-badge-count');
  if (badge) badge.textContent = bookings.length;
};

// Stepper Navigation Logic
window.goToStep = function(step) {
  if (step > currentStep && !validateCurrentStep()) return;

  currentStep = step;

  // Update Stepper Indicators
  document.querySelectorAll('.step-item').forEach((item, index) => {
    const stepNum = index + 1;
    item.classList.remove('active', 'completed');
    if (stepNum === currentStep) {
      item.classList.add('active');
    } else if (stepNum < currentStep) {
      item.classList.add('completed');
    }
  });

  const progressBar = document.querySelector('.stepper-progress');
  if (progressBar) {
    progressBar.style.width = `${((currentStep - 1) / 3) * 90}%`;
  }

  // Update Form Step Cards
  document.querySelectorAll('.form-step-content').forEach(card => card.style.display = 'none');
  const activeStepContent = document.getElementById(`form-step-${currentStep}`);
  if (activeStepContent) activeStepContent.style.display = 'block';

  // Toggle Action Buttons
  const prevBtn = document.getElementById('prev-step-btn');
  const nextBtn = document.getElementById('next-step-btn');
  const submitBtn = document.getElementById('submit-reg-btn');

  if (prevBtn) prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
  if (nextBtn) nextBtn.style.display = currentStep < 4 ? 'inline-flex' : 'none';
  if (submitBtn) submitBtn.style.display = currentStep === 4 ? 'inline-flex' : 'none';

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.nextStep = function() {
  if (currentStep < 4) window.goToStep(currentStep + 1);
};

window.prevStep = function() {
  if (currentStep > 1) window.goToStep(currentStep - 1);
};

// Step Validations
function validateCurrentStep() {
  if (currentStep === 1) {
    const nameEl = document.getElementById('input-name');
    const phoneEl = document.getElementById('input-phone');
    const collegeEl = document.getElementById('input-college');

    const name = nameEl ? nameEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const college = collegeEl ? collegeEl.value.trim() : '';

    if (!name || !phone || !college) {
      window.showToast('⚠️ Please fill in Full Name, Phone, and College Name');
      return false;
    }
  }
  return true;
}

// Real-Time Pricing Calculator (Item 6)
window.calculatePricing = function() {
  const eventTypeEl = document.getElementById('event-type-select');
  const venueEl = document.getElementById('venue-select');
  const guestCountEl = document.getElementById('guest-count-range');

  const eventTypeId = eventTypeEl ? eventTypeEl.value : 'hack-alliance';
  const venueId = venueEl ? venueEl.value : 'tech-park-hall';
  const guestCount = guestCountEl ? (parseInt(guestCountEl.value) || 1) : 4;

  const selectedEvent = EVENT_TYPES.find(e => e.id === eventTypeId) || EVENT_TYPES[0];
  const baseFee = selectedEvent.baseFee;
  const multiplier = selectedEvent.multiplier;

  const extraMembers = Math.max(0, guestCount - 1);
  const memberSurcharge = extraMembers * 150;

  let addonsTotal = 0;
  const selectedAddonNames = [];
  document.querySelectorAll('.addon-checkbox:checked').forEach(cb => {
    const price = parseInt(cb.getAttribute('data-price')) || 0;
    addonsTotal += price;
    selectedAddonNames.push(cb.getAttribute('data-name'));
  });

  const subtotal = Math.round((baseFee * multiplier) + memberSurcharge + addonsTotal);
  const tax = Math.round(subtotal * 0.18);
  const totalPrice = subtotal + tax;

  // Update Invoice Breakdown HTML Table
  const baseFeeEl = document.getElementById('price-base-fee');
  const multEl = document.getElementById('price-multiplier');
  const surchargeEl = document.getElementById('price-team-surcharge');
  const addonsTotalEl = document.getElementById('price-addons-total');
  const taxEl = document.getElementById('price-tax');
  const grandTotalEl = document.getElementById('price-grand-total');
  const finalTotalEl = document.getElementById('summary-final-total');

  if (baseFeeEl) baseFeeEl.textContent = `₹${baseFee.toLocaleString()}`;
  if (multEl) multEl.textContent = `₹${Math.round(baseFee * (multiplier - 1)).toLocaleString()}`;
  if (surchargeEl) surchargeEl.textContent = `₹${memberSurcharge.toLocaleString()}`;
  if (addonsTotalEl) addonsTotalEl.textContent = `₹${addonsTotal.toLocaleString()}`;
  if (taxEl) taxEl.textContent = `₹${tax.toLocaleString()}`;
  if (grandTotalEl) grandTotalEl.textContent = `₹${totalPrice.toLocaleString()}`;
  if (finalTotalEl) finalTotalEl.textContent = `₹${totalPrice.toLocaleString()}`;

  return {
    selectedEvent,
    guestCount,
    selectedAddonNames,
    baseFee,
    multiplier,
    memberSurcharge,
    addonsTotal,
    tax,
    totalPrice
  };
};

// Payment Method Toggle
window.setPaymentMethod = function(method) {
  const onlineCard = document.getElementById('payment-method-online-card');
  const cashCard = document.getElementById('payment-method-cash-card');
  const onlineFields = document.getElementById('online-payment-fields');
  const cashFields = document.getElementById('cash-payment-fields');

  if (onlineCard) onlineCard.style.borderColor = method === 'online' ? 'var(--accent-primary)' : 'var(--border-color)';
  if (cashCard) cashCard.style.borderColor = method === 'cash' ? 'var(--accent-primary)' : 'var(--border-color)';
  if (onlineFields) onlineFields.style.display = method === 'online' ? 'block' : 'none';
  if (cashFields) cashFields.style.display = method === 'cash' ? 'block' : 'none';
};

// Submit Form Registration & Generate E-Pass (Item 8)
window.submitRegistration = function() {
  if (!validateCurrentStep()) return;

  const calc = window.calculatePricing();
  const name = document.getElementById('input-name').value.trim();
  const phone = document.getElementById('input-phone').value.trim();
  const email = document.getElementById('input-email').value.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@student.alliance.edu.in`;
  const college = document.getElementById('input-college').value.trim();
  const rollNo = document.getElementById('input-roll').value.trim() || 'AL2026-N/A';
  const address = document.getElementById('input-address').value.trim();

  const venueId = document.getElementById('venue-select').value;
  const selectedVenue = VENUES.find(v => v.id === venueId) || VENUES[0];
  const eventDate = document.getElementById('event-date-select').value;
  const startTime = document.getElementById('start-time-input').value;

  const paymentMethod = document.querySelector('input[name="pay-method"]:checked')?.value || 'online';
  const bookingId = `ALLIANCE-ONE-${Math.floor(1000 + Math.random() * 9000)}`;

  const newBooking = {
    id: bookingId,
    customerName: name,
    phone: phone,
    email: email,
    collegeName: college,
    rollNumber: rollNo,
    address: address,
    eventTypeName: calc.selectedEvent.name,
    venueName: selectedVenue.name,
    venueLocation: selectedVenue.location,
    eventDate: eventDate,
    startTime: startTime,
    endTime: '18:00',
    guestCount: calc.guestCount,
    selectedAddons: calc.selectedAddonNames,
    baseFee: calc.baseFee,
    multiplier: calc.multiplier,
    memberSurcharge: calc.memberSurcharge,
    addonsTotal: calc.addonsTotal,
    tax: calc.tax,
    totalPrice: calc.totalPrice,
    paymentMethod: paymentMethod,
    transactionId: paymentMethod === 'online' ? `TXN-UPI-AL1-${Math.floor(100000 + Math.random() * 900000)}` : `CASH-CAMPUS-${Math.floor(1000 + Math.random() * 9000)}`,
    bookingStatus: 'Confirmed'
  };

  bookings.unshift(newBooking);
  localStorage.setItem('alliance_one_bookings_v1', JSON.stringify(bookings));
  window.updateBookingsCount();

  window.renderTicketPass(newBooking);
  window.showView('status');
  window.showToast(`🎉 Registration Confirmed! Pass ID: ${bookingId}`);
};

// Render E-Ticket Pass View
window.renderTicketPass = function(booking) {
  activeBooking = booking;

  const setTex = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setTex('pass-ref-id', booking.id);
  setTex('pass-delegate-name', booking.customerName);
  setTex('pass-college-name', booking.collegeName);
  setTex('pass-roll-no', booking.rollNumber);
  setTex('pass-phone', booking.phone);
  setTex('pass-email', booking.email);

  setTex('pass-event-name', booking.eventTypeName);
  setTex('pass-venue-name', booking.venueName);
  setTex('pass-venue-location', booking.venueLocation);
  setTex('pass-event-date', booking.eventDate);
  setTex('pass-event-slot', `${booking.startTime} to 18:00`);
  setTex('pass-team-size', `${booking.guestCount} Participants`);

  setTex('pass-base-fee', `₹${(booking.baseFee || 1000).toLocaleString()}`);
  setTex('pass-multiplier', `Multiplier: ${booking.multiplier || 1.2}x`);
  setTex('pass-addons-list', booking.selectedAddons && booking.selectedAddons.length ? booking.selectedAddons.join(', ') : 'None');
  setTex('pass-grand-total', `₹${booking.totalPrice.toLocaleString()}`);

  setTex('pass-payment-mode', `Payment Mode: ${booking.paymentMethod === 'online' ? 'Online Mode' : 'Campus Cash Helpdesk'}`);
  setTex('pass-txn-id', `Transaction Ref: ${booking.transactionId}`);
};

// Bookings Modal Manager
window.openBookingsModal = function() {
  window.renderBookingsList();
  const modal = document.getElementById('bookings-modal');
  if (modal) modal.classList.add('active');
};

window.closeBookingsModal = function() {
  const modal = document.getElementById('bookings-modal');
  if (modal) modal.classList.remove('active');
};

window.renderBookingsList = function() {
  const container = document.getElementById('bookings-list-container');
  if (!container) return;

  if (bookings.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 40px 0; color: var(--text-secondary)">No registered bookings found.</div>';
    return;
  }

  container.innerHTML = bookings.map(b => `
    <div style="padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-color); background-color: var(--bg-primary); display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 6px;">
          <strong style="color: var(--accent-primary);">${b.id}</strong>
          <span class="badge badge-emerald" style="font-size: 0.75rem">${b.eventTypeName}</span>
        </div>
        <div style="font-weight: 600;">${b.customerName} (${b.collegeName || 'Alliance Univ'})</div>
        <div style="font-size: 0.85rem; color: var(--text-secondary);">${b.venueName} • ${b.eventDate}</div>
      </div>
      <div style="display: flex; gap: 12px; align-items: center;">
        <div style="font-weight: 800; color: var(--accent-primary); font-size: 1.1rem;">₹${b.totalPrice.toLocaleString()}</div>
        <button class="btn btn-primary btn-sm" onclick="window.viewSingleBooking('${b.id}')">View Ticket</button>
      </div>
    </div>
  `).join('');
};

window.viewSingleBooking = function(id) {
  const found = bookings.find(b => b.id === id);
  if (found) {
    window.renderTicketPass(found);
    window.closeBookingsModal();
    window.showView('status');
  }
};

window.showToast = function(msg) {
  const notice = document.getElementById('toast-notice');
  if (notice) {
    notice.textContent = msg;
    notice.classList.add('active');
    setTimeout(() => {
      notice.classList.remove('active');
    }, 4000);
  }
};

window.printTicketPass = function() {
  window.print();
};

// DOM Initialization
document.addEventListener('DOMContentLoaded', () => {
  window.updateBookingsCount();
  window.calculatePricing();

  const eventSelect = document.getElementById('event-type-select');
  if (eventSelect) eventSelect.addEventListener('change', window.calculatePricing);

  const venueSelect = document.getElementById('venue-select');
  if (venueSelect) venueSelect.addEventListener('change', window.calculatePricing);

  const guestRange = document.getElementById('guest-count-range');
  if (guestRange) {
    guestRange.addEventListener('input', (e) => {
      const label = document.getElementById('guest-count-label');
      if (label) label.textContent = `${e.target.value} Participants`;
      window.calculatePricing();
    });
  }

  document.querySelectorAll('.addon-checkbox').forEach(cb => {
    cb.addEventListener('change', window.calculatePricing);
  });
});
