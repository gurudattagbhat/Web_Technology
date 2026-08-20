import React, { useState, useMemo } from 'react';
import { EVENT_TYPES, VENUES, ADDONS, COLLEGE_FEST_INFO } from '../data/eventData';
import { 
  User, Phone, MapPin, Mail, Calendar, Clock, DollarSign, CreditCard, 
  Banknote, CheckCircle, ArrowRight, ArrowLeft, ShieldCheck, Sparkles, Check, Info, GraduationCap, Building
} from 'lucide-react';

export default function RegistrationForm({ initialVenueId, initialEventType, onSubmitBooking, onCancel }) {
  // Steps: 1 = Delegate Info, 2 = Event & Arena, 3 = Prices & Add-ons, 4 = Payment Options
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    collegeName: 'Alliance University',
    rollNumber: '',
    address: '',

    eventType: initialEventType || 'battle-of-bands',
    venueId: initialVenueId || 'central-quad',
    eventDate: '2026-10-24',
    startTime: '10:00',
    endTime: '18:00',
    guestCount: 4, // Team size

    selectedAddons: ['fest-tshirt', 'food-pass'],

    paymentMethod: 'online', // 'online' | 'cash'
    onlineSubtype: 'upi',    // 'upi' | 'card' | 'netbanking'
    upiId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const toggleAddon = (addonId) => {
    setFormData((prev) => {
      const exists = prev.selectedAddons.includes(addonId);
      return {
        ...prev,
        selectedAddons: exists 
          ? prev.selectedAddons.filter((id) => id !== addonId)
          : [...prev.selectedAddons, addonId]
      };
    });
  };

  const selectedVenue = useMemo(() => {
    return VENUES.find((v) => v.id === formData.venueId) || VENUES[0];
  }, [formData.venueId]);

  const selectedType = useMemo(() => {
    return EVENT_TYPES.find((t) => t.id === formData.eventType) || EVENT_TYPES[0];
  }, [formData.eventType]);

  // Pricing Calculation specifically for College Fest Registration
  const pricing = useMemo(() => {
    const baseFee = selectedType.baseFee || 1000;
    const typeMultiplier = selectedType.basePriceMultiplier;
    
    // Team member surcharge (₹150 per extra member beyond 1st)
    const extraMembers = Math.max(0, formData.guestCount - 1);
    const memberSurcharge = extraMembers * 150;

    let addonsTotal = 0;
    formData.selectedAddons.forEach((addonId) => {
      const addonObj = ADDONS.find((a) => a.id === addonId);
      if (addonObj) {
        if (addonObj.flatPrice) {
          addonsTotal += addonObj.flatPrice;
        }
      }
    });

    const subtotal = Math.round((baseFee * typeMultiplier) + memberSurcharge + addonsTotal);
    const tax = Math.round(subtotal * 0.18); // 18% GST / Festival Amenities Levy
    const totalPrice = subtotal + tax;

    return {
      baseRent: baseFee,
      typeMultiplier,
      guestSurcharge: memberSurcharge,
      addonsTotal,
      subtotal,
      tax,
      totalPrice
    };
  }, [selectedVenue, selectedType, formData.guestCount, formData.selectedAddons]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full Name is required';
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^[0-9+\-\s]{8,15}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
      if (!formData.collegeName.trim()) newErrors.collegeName = 'College / University Name is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
    }

    if (step === 2) {
      if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
      if (!formData.startTime) newErrors.startTime = 'Start time is required';
    }

    if (step === 4) {
      if (formData.paymentMethod === 'online' && formData.onlineSubtype === 'upi') {
        if (!formData.upiId.trim() || !formData.upiId.includes('@')) {
          newErrors.upiId = 'Please enter a valid UPI ID (e.g. student@upi)';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(4, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    const bookingId = `ALLIANCE-ONE-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: bookingId,
      customerName: formData.name,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@student.alliance.edu.in`,
      collegeName: formData.collegeName,
      rollNumber: formData.rollNumber || 'AL2026-N/A',
      address: formData.address,
      eventType: formData.eventType,
      eventTypeName: selectedType.name,
      venueId: formData.venueId,
      venueName: selectedVenue.name,
      venueLocation: `${selectedVenue.location}, ${selectedVenue.city}`,
      eventDate: formData.eventDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      guestCount: Number(formData.guestCount),
      selectedAddons: formData.selectedAddons,
      pricing: pricing,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentMethod === 'online' ? 'paid' : 'cash_pending',
      transactionId: formData.paymentMethod === 'online' 
        ? `TXN-UPI-AL1-${Math.floor(100000 + Math.random() * 900000)}`
        : `CASH-CAMPUS-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingStatus: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    onSubmitBooking(newBooking);
  };

  return (
    <div className="container animate-slide-up" style={{ padding: '40px 48px 80px', width: '100%' }}>
      {/* Fest Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="badge badge-emerald" style={{ marginBottom: '10px' }}>
          Alliance ONE 2026 — Official Delegate Registration
        </span>
        <h2 style={{ fontSize: '2.4rem' }}>{COLLEGE_FEST_INFO.universityName} Event Registration</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '1.05rem' }}>
          Complete your registration form to get your Official Fest Pass & Competition Slot.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="stepper" style={{ maxWidth: '1000px', margin: '0 auto 44px' }}>
        <div 
          className="stepper-progress" 
          style={{ width: `${((currentStep - 1) / 3) * 90}%` }}
        />

        <div className={`step-item ${currentStep >= 1 ? (currentStep > 1 ? 'completed' : 'active') : ''}`}>
          <div className="step-bubble">{currentStep > 1 ? <Check size={20} /> : '1'}</div>
          <div className="step-label">Delegate Info</div>
        </div>

        <div className={`step-item ${currentStep >= 2 ? (currentStep > 2 ? 'completed' : 'active') : ''}`}>
          <div className="step-bubble">{currentStep > 2 ? <Check size={20} /> : '2'}</div>
          <div className="step-label">Event & Arena</div>
        </div>

        <div className={`step-item ${currentStep >= 3 ? (currentStep > 3 ? 'completed' : 'active') : ''}`}>
          <div className="step-bubble">{currentStep > 3 ? <Check size={20} /> : '3'}</div>
          <div className="step-label">Fees & Pass Addons</div>
        </div>

        <div className={`step-item ${currentStep >= 4 ? 'active' : ''}`}>
          <div className="step-bubble">4</div>
          <div className="step-label">Payment & E-Ticket</div>
        </div>
      </div>

      {/* Expansive Full Page Form Card */}
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="card" style={{ padding: '44px' }}>
          <form onSubmit={(e) => e.preventDefault()}>
            
            {/* STEP 1: Student / Participant Information (Item 3) */}
            {currentStep === 1 && (
              <div className="animate-slide-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                  <User color="var(--accent-primary)" size={26} />
                  <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Step 1: Student & College Delegate Details</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label className="form-label">
                      <User size={16} /> Student Full Name <span style={{ color: 'var(--accent-primary)' }}>*</span>
                    </label>
                    <input 
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder="e.g. Ananya Hegde"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <span style={{ color: 'var(--accent-primary)', fontSize: '0.82rem', fontWeight: 600 }}>{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Phone size={16} /> Phone Number <span style={{ color: 'var(--accent-primary)' }}>*</span>
                    </label>
                    <input 
                      type="tel"
                      name="phone"
                      className="form-input"
                      placeholder="e.g. +91 98450 11223"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && <span style={{ color: 'var(--accent-primary)', fontSize: '0.82rem', fontWeight: 600 }}>{errors.phone}</span>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label className="form-label">
                      <Building size={16} /> College / University Name <span style={{ color: 'var(--accent-primary)' }}>*</span>
                    </label>
                    <input 
                      type="text"
                      name="collegeName"
                      className="form-input"
                      placeholder="e.g. Alliance University / PES University / RVCE"
                      value={formData.collegeName}
                      onChange={handleChange}
                    />
                    {errors.collegeName && <span style={{ color: 'var(--accent-primary)', fontSize: '0.82rem', fontWeight: 600 }}>{errors.collegeName}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <GraduationCap size={16} /> USN / Student Roll Number
                    </label>
                    <input 
                      type="text"
                      name="rollNumber"
                      className="form-input"
                      placeholder="e.g. 1AL24CS042"
                      value={formData.rollNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Mail size={16} /> Student Email Address (For Fest E-Pass Delivery)
                  </label>
                  <input 
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="e.g. ananya.h@alliance.edu.in"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <MapPin size={16} /> Hostel / Residential Address <span style={{ color: 'var(--accent-primary)' }}>*</span>
                  </label>
                  <textarea 
                    name="address"
                    className="form-textarea"
                    rows={3}
                    placeholder="Enter complete residential or campus hostel room address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  {errors.address && <span style={{ color: 'var(--accent-primary)', fontSize: '0.82rem', fontWeight: 600 }}>{errors.address}</span>}
                </div>
              </div>
            )}

            {/* STEP 2: Event Dropdown, Location & Schedule (Items 4 & 5) */}
            {currentStep === 2 && (
              <div className="animate-slide-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                  <Calendar color="var(--accent-primary)" size={26} />
                  <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Step 2: Alliance ONE Event Dropdown & Campus Arena</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {/* Select Event Type (Dropdown - Requirement 4) */}
                  <div className="form-group">
                    <label className="form-label">
                      Select Event Type (Dropdown) <span style={{ color: 'var(--accent-primary)' }}>*</span>
                    </label>
                    <select 
                      name="eventType"
                      className="form-select"
                      value={formData.eventType}
                      onChange={handleChange}
                    >
                      {EVENT_TYPES.map((type) => (
                        <option key={type.id} value={type.id}>
                          [{type.category}] {type.name} — Base ₹{type.baseFee} ({type.teamType})
                        </option>
                      ))}
                    </select>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Selected Event: <strong>{selectedType.name}</strong> - {selectedType.description}
                    </span>
                  </div>

                  {/* Select Campus Location (Requirement 5) */}
                  <div className="form-group">
                    <label className="form-label">
                      Select Campus Location & Venue <span style={{ color: 'var(--accent-primary)' }}>*</span>
                    </label>
                    <select 
                      name="venueId"
                      className="form-select"
                      value={formData.venueId}
                      onChange={handleChange}
                    >
                      {VENUES.map((venue) => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name} ({venue.location})
                        </option>
                      ))}
                    </select>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      <MapPin size={13} inline /> Location: <strong>{selectedVenue.location}, Alliance Campus</strong>
                    </span>
                  </div>
                </div>

                {/* Venue Preview Box */}
                <div style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  backgroundColor: 'var(--accent-primary-light)', 
                  padding: '20px', 
                  borderRadius: 'var(--radius-md)', 
                  marginBottom: '24px',
                  alignItems: 'center'
                }}>
                  <img 
                    src={selectedVenue.image} 
                    alt={selectedVenue.name} 
                    style={{ width: '120px', height: '80px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div>
                    <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--accent-primary)' }}>
                      {selectedVenue.name}
                    </strong>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      Campus Location: <strong>{selectedVenue.location}</strong> | Arena Seating: <strong>{selectedVenue.capacity} Capacity</strong>
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">
                      <Calendar size={14} /> Fest Date <span style={{ color: 'var(--accent-primary)' }}>*</span>
                    </label>
                    <select 
                      name="eventDate"
                      className="form-select"
                      value={formData.eventDate}
                      onChange={handleChange}
                    >
                      <option value="2026-10-24">Oct 24, 2026 (Day 1 - Inaugral & Hacks)</option>
                      <option value="2026-10-25">Oct 25, 2026 (Day 2 - Cultural Battles)</option>
                      <option value="2026-10-26">Oct 26, 2026 (Day 3 - Pro-Night & Valedictory)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Clock size={14} /> Start Time Slot <span style={{ color: 'var(--accent-primary)' }}>*</span>
                    </label>
                    <input 
                      type="time"
                      name="startTime"
                      className="form-input"
                      value={formData.startTime}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Clock size={14} /> Expected End Time
                    </label>
                    <input 
                      type="time"
                      name="endTime"
                      className="form-input"
                      value={formData.endTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Team Member Count Slider */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="form-label">Total Team Members / Squad Size</label>
                    <strong style={{ color: 'var(--accent-primary)', fontSize: '1.15rem' }}>
                      {formData.guestCount} Participants
                    </strong>
                  </div>
                  <input 
                    type="range"
                    name="guestCount"
                    min="1"
                    max="15"
                    step="1"
                    value={formData.guestCount}
                    onChange={handleChange}
                    style={{ width: '100%', accentColor: 'var(--accent-primary)', margin: '12px 0' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Solo (1)</span>
                    <span>Format: {selectedType.teamType}</span>
                    <span>Max Team: 15</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Fees & Pass Add-ons (Requirement 6) */}
            {currentStep === 3 && (
              <div className="animate-slide-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                  <DollarSign color="var(--accent-primary)" size={26} />
                  <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Step 3: Registration Fee & Official Merchandise Pass</h3>
                </div>

                <label className="form-label" style={{ marginBottom: '14px' }}>
                  Select Official Alliance ONE Fest Add-ons:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                  {ADDONS.map((addon) => {
                    const isSelected = formData.selectedAddons.includes(addon.id);
                    const calculatedPrice = addon.flatPrice;

                    return (
                      <div 
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        style={{
                          padding: '20px',
                          borderRadius: 'var(--radius-md)',
                          border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                          backgroundColor: isSelected ? 'var(--accent-primary-light)' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'var(--transition-fast)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <strong style={{ fontSize: '1rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                            {addon.name}
                          </strong>
                          <div style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            backgroundColor: isSelected ? 'var(--accent-primary)' : '#FFFFFF',
                            border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px'
                          }}>
                            {isSelected && <Check size={14} />}
                          </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '8px 0 12px' }}>
                          {addon.description}
                        </p>
                        <div style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '0.95rem' }}>
                          + ₹{calculatedPrice.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown Invoice Table (Requirement 6) */}
                <div style={{
                  backgroundColor: 'var(--bg-primary)',
                  padding: '28px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <h4 style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem' }}>
                    <Sparkles size={20} color="var(--accent-gold)" /> Event Registration Fee Calculation
                  </h4>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px dashed var(--border-color)' }}>
                        <td style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>
                          Base Registration Fee ({selectedType.name})
                        </td>
                        <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600 }}>
                          ₹{selectedType.baseFee.toLocaleString()}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px dashed var(--border-color)' }}>
                        <td style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>
                          Event Scale Multiplier ({selectedType.category} - {pricing.typeMultiplier}x)
                        </td>
                        <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600 }}>
                          ₹{Math.round(selectedType.baseFee * (pricing.typeMultiplier - 1)).toLocaleString()}
                        </td>
                      </tr>
                      {pricing.guestSurcharge > 0 && (
                        <tr style={{ borderBottom: '1px dashed var(--border-color)' }}>
                          <td style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>
                            Team Member Registration Charges ({formData.guestCount - 1} extra members)
                          </td>
                          <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600 }}>
                            ₹{pricing.guestSurcharge.toLocaleString()}
                          </td>
                        </tr>
                      )}
                      <tr style={{ borderBottom: '1px dashed var(--border-color)' }}>
                        <td style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>
                          Selected Merchandise & Fest Add-ons
                        </td>
                        <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600 }}>
                          ₹{pricing.addonsTotal.toLocaleString()}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px dashed var(--border-color)' }}>
                        <td style={{ padding: '12px 0', color: 'var(--text-secondary)' }}>
                          Festival Amenities & Service Tax (18%)
                        </td>
                        <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600 }}>
                          ₹{pricing.tax.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '16px 0 0', fontWeight: 800, fontSize: '1.15rem' }}>
                          Total Delegate Fee:
                        </td>
                        <td style={{ padding: '16px 0 0', textAlign: 'right', fontWeight: 800, fontSize: '1.35rem', color: 'var(--accent-primary)' }}>
                          ₹{pricing.totalPrice.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* STEP 4: Payment Options (Requirement 7) */}
            {currentStep === 4 && (
              <div className="animate-slide-up">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                  <CreditCard color="var(--accent-primary)" size={26} />
                  <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Step 4: Fee Payment Option (Online / Campus Cash Desk)</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                  <div 
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'online' }))}
                    style={{
                      padding: '24px',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${formData.paymentMethod === 'online' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                      backgroundColor: formData.paymentMethod === 'online' ? 'var(--accent-primary-light)' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <CreditCard size={24} color="var(--accent-primary)" />
                      <strong style={{ fontSize: '1.1rem' }}>Online Payment</strong>
                      <span className="badge badge-gold" style={{ marginLeft: 'auto' }}>Instant E-Pass</span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      Pay via UPI (GPay/PhonePe), Credit/Debit Card, or Net Banking instantly.
                    </p>
                  </div>

                  <div 
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cash' }))}
                    style={{
                      padding: '24px',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${formData.paymentMethod === 'cash' ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                      backgroundColor: formData.paymentMethod === 'cash' ? 'var(--accent-primary-light)' : '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <Banknote size={24} color="var(--accent-sage)" />
                      <strong style={{ fontSize: '1.1rem' }}>Cash at Campus Desk</strong>
                      <span className="badge badge-sage" style={{ marginLeft: 'auto' }}>Alliance Helpdesk</span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                      Pay cash at the Alliance University Student Center registration desk.
                    </p>
                  </div>
                </div>

                {formData.paymentMethod === 'online' ? (
                  <div style={{ 
                    padding: '24px', 
                    backgroundColor: 'var(--bg-primary)', 
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '28px' 
                  }}>
                    <div style={{ display: 'flex', gap: '14px', marginBottom: '18px' }}>
                      <button 
                        type="button"
                        className={`btn btn-sm ${formData.onlineSubtype === 'upi' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFormData(prev => ({ ...prev, onlineSubtype: 'upi' }))}
                      >
                        UPI Instant (GPay / PhonePe)
                      </button>
                      <button 
                        type="button"
                        className={`btn btn-sm ${formData.onlineSubtype === 'card' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFormData(prev => ({ ...prev, onlineSubtype: 'card' }))}
                      >
                        Credit / Debit Card
                      </button>
                    </div>

                    {formData.onlineSubtype === 'upi' && (
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label">Enter Student UPI ID</label>
                        <input 
                          type="text"
                          name="upiId"
                          className="form-input"
                          placeholder="e.g. student@upi or mobile@okaxis"
                          value={formData.upiId}
                          onChange={handleChange}
                        />
                        {errors.upiId && <span style={{ color: 'var(--accent-primary)', fontSize: '0.82rem', fontWeight: 600 }}>{errors.upiId}</span>}
                      </div>
                    )}

                    {formData.onlineSubtype === 'card' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px' }}>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Card Number (4532 ....)" 
                          defaultValue="4532 8912 3456 7890"
                        />
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="MM/YY" 
                          defaultValue="10/28"
                        />
                        <input 
                          type="password" 
                          className="form-input" 
                          placeholder="CVC" 
                          defaultValue="567"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ 
                    padding: '22px', 
                    backgroundColor: 'var(--accent-sage-light)', 
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--accent-sage)',
                    marginBottom: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px' 
                  }}>
                    <Info size={26} />
                    <div style={{ fontSize: '0.92rem' }}>
                      <strong>Cash Payment Note:</strong> Present your Registration ID at Alliance Campus Student Center within 24 hours to confirm your spot.
                    </div>
                  </div>
                )}

                {/* Final Order Confirmation Summary Box */}
                <div style={{ 
                  padding: '24px', 
                  border: '2px solid var(--accent-primary)', 
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '28px',
                  backgroundColor: 'var(--accent-primary-light)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Delegate: <strong>{formData.name}</strong> ({formData.collegeName})
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Competition: <strong>{selectedType.name}</strong> @ <strong>{selectedVenue.name}</strong>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Fest Date & Time: <strong>{formData.eventDate}</strong> ({formData.startTime})
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Final Fee</span>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                        ₹{pricing.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ 
              display: 'flex', 
              justify: 'space-between', 
              marginTop: '36px', 
              paddingTop: '24px',
              borderTop: '1px solid var(--border-color)' 
            }}>
              {currentStep > 1 ? (
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={handlePrev}
                >
                  <ArrowLeft size={18} /> Back
                </button>
              ) : (
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={onCancel}
                >
                  Cancel
                </button>
              )}

              {currentStep < 4 ? (
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleNext}
                >
                  Next Step <ArrowRight size={18} />
                </button>
              ) : (
                <button 
                  type="button" 
                  className="btn btn-primary btn-lg"
                  onClick={handleSubmit}
                >
                  Confirm Registration & Get Fest E-Ticket <CheckCircle size={20} />
                </button>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
