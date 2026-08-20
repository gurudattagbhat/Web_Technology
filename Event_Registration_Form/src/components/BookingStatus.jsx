import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, Calendar, MapPin, User, Phone, Mail, Clock, 
  Printer, ArrowLeft, Download, ShieldCheck, Ticket, Sparkles, Check, GraduationCap, Building, QrCode
} from 'lucide-react';
import { ADDONS, COLLEGE_FEST_INFO } from '../data/eventData';

export default function BookingStatus({ booking, navigateTo, onOpenAllBookings }) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#2D6A4F', '#C68B59', '#E9C46A', '#52796F']
      });
    } catch (e) {
      console.log('Confetti effect unavailable', e);
    }
  }, []);

  if (!booking) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>No Active Registration Found</h2>
        <button className="btn btn-primary" onClick={() => navigateTo('dashboard')} style={{ marginTop: '20px' }}>
          Return to Fest Dashboard
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container animate-slide-up" style={{ padding: '48px 48px 100px', width: '100%' }}>
      {/* Fest Header Banner */}
      <div className="btn-no-print" style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div className="badge badge-emerald" style={{ padding: '8px 18px', fontSize: '0.92rem', marginBottom: '14px' }}>
          <CheckCircle2 size={18} /> Fest Registration Confirmed!
        </div>
        <h2 style={{ fontSize: '2.4rem' }}>{COLLEGE_FEST_INFO.universityName} — Alliance ONE E-Pass</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '1.05rem' }}>
          Your entry pass and competition slot have been confirmed. Below is your official delegate pass.
        </p>
      </div>

      {/* Progress Status (Requirement 8) */}
      <div className="btn-no-print card" style={{ padding: '28px', marginBottom: '36px', maxWidth: '1100px', margin: '0 auto 36px' }}>
        <h4 style={{ marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem' }}>
          <Sparkles size={20} color="var(--accent-gold)" /> Delegate Registration Status
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', textAlign: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-sage)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px',
              fontWeight: 700
            }}>
              <Check size={20} />
            </div>
            <strong style={{ fontSize: '0.92rem', display: 'block' }}>1. Registration Submitted</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Student Info Verified</span>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-sage)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px',
              fontWeight: 700
            }}>
              <Check size={20} />
            </div>
            <strong style={{ fontSize: '0.92rem', display: 'block' }}>2. Fee Status</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-sage)', fontWeight: 600 }}>
              {booking.paymentMethod === 'online' ? 'Paid Online' : 'Pay at Campus Desk'}
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-primary)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px',
              fontWeight: 700
            }}>
              <Check size={20} />
            </div>
            <strong style={{ fontSize: '0.92rem', display: 'block', color: 'var(--accent-primary)' }}>
              3. Competition Slot Allocated
            </strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Arena Locked</span>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-amber-light)',
              color: 'var(--accent-gold)',
              border: '2px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px',
              fontWeight: 700
            }}>
              4
            </div>
            <strong style={{ fontSize: '0.92rem', display: 'block' }}>4. Ready for Fest</strong>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Oct 24 - 26, 2026</span>
          </div>
        </div>
      </div>

      {/* Printable College Fest E-Ticket Pass */}
      <div className="printable-card card" style={{ maxWidth: '1100px', margin: '0 auto', overflow: 'hidden' }}>
        {/* Ticket Header Bar */}
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-primary) 0%, #1B4D3E 100%)',
          color: '#FFFFFF',
          padding: '28px 40px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <GraduationCap size={20} />
              <span style={{ fontSize: '0.85rem', opacity: 0.9, letterSpacing: '1px', textTransform: 'uppercase' }}>
                {COLLEGE_FEST_INFO.universityName}
              </span>
            </div>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.9rem' }}>
              Alliance ONE 2026 — Official Delegate Entry Pass
            </h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>Pass Reference ID</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '1px' }}>
              {booking.id}
            </div>
          </div>
        </div>

        {/* Ticket Body */}
        <div style={{ padding: '40px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '36px', marginBottom: '36px' }}>
            {/* Student & Event Information */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Student Details (Item 3) */}
              <div style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  Student Delegate Info
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} color="var(--accent-primary)" />
                    <span style={{ color: 'var(--text-secondary)' }}>Name:</span>
                    <strong>{booking.customerName}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building size={16} color="var(--accent-primary)" />
                    <span style={{ color: 'var(--text-secondary)' }}>College:</span>
                    <strong>{booking.collegeName || 'Alliance University'}</strong>
                  </div>

                  {booking.rollNumber && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <GraduationCap size={16} color="var(--accent-primary)" />
                      <span style={{ color: 'var(--text-secondary)' }}>USN/Roll:</span>
                      <strong>{booking.rollNumber}</strong>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={16} color="var(--accent-primary)" />
                    <span style={{ color: 'var(--text-secondary)' }}>Phone:</span>
                    <strong>{booking.phone}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={16} color="var(--accent-primary)" />
                    <span style={{ color: 'var(--text-secondary)' }}>Email:</span>
                    <span>{booking.email}</span>
                  </div>
                </div>
              </div>

              {/* Competition Schedule (Items 4 & 5) */}
              <div style={{
                backgroundColor: 'var(--bg-primary)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  Event & Campus Arena
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Registered Event: </span>
                    <strong style={{ color: 'var(--accent-primary)' }}>{booking.eventTypeName}</strong>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Campus Arena: </span>
                    <strong>{booking.venueName}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{booking.venueLocation}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} color="var(--accent-primary)" />
                    <span style={{ color: 'var(--text-secondary)' }}>Date:</span>
                    <strong>{booking.eventDate}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} color="var(--accent-primary)" />
                    <span style={{ color: 'var(--text-secondary)' }}>Slot:</span>
                    <strong>{booking.startTime} to {booking.endTime}</strong>
                  </div>

                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Team Size: </span>
                    <strong>{booking.guestCount} Participants</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Pass Security Badge */}
            <div style={{
              backgroundColor: 'var(--accent-primary-light)',
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              border: '2px dashed var(--accent-primary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <QrCode size={120} color="var(--accent-primary)" style={{ marginBottom: '12px' }} />
              <strong style={{ fontSize: '0.95rem', color: 'var(--accent-primary)' }}>Official E-Pass Security QR</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Scan at Alliance Campus Entrance Gate
              </span>
            </div>
          </div>

          {/* Pricing Invoice Table (Item 6) */}
          <div style={{ marginBottom: '36px' }}>
            <h4 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>Itemized Registration Fee Breakdown</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--accent-primary-light)', textAlign: 'left' }}>
                  <th style={{ padding: '14px', borderRadius: '8px 0 0 8px' }}>Description / Item</th>
                  <th style={{ padding: '14px' }}>Details</th>
                  <th style={{ padding: '14px', textAlign: 'right', borderRadius: '0 8px 8px 0' }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px' }}>Base Event Registration Fee</td>
                  <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{booking.eventTypeName}</td>
                  <td style={{ padding: '14px', textAlign: 'right', fontWeight: 600 }}>
                    ₹{booking.pricing.baseRent.toLocaleString()}
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px' }}>Event Category Scale Factor</td>
                  <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>Multiplier: {booking.pricing.typeMultiplier}x</td>
                  <td style={{ padding: '14px', textAlign: 'right', fontWeight: 600 }}>
                    ₹{Math.round(booking.pricing.baseRent * (booking.pricing.typeMultiplier - 1)).toLocaleString()}
                  </td>
                </tr>

                {booking.pricing.guestSurcharge > 0 && (
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '14px' }}>Team Member Registration Surcharge</td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{booking.guestCount} members</td>
                    <td style={{ padding: '14px', textAlign: 'right', fontWeight: 600 }}>
                      ₹{booking.pricing.guestSurcharge.toLocaleString()}
                    </td>
                  </tr>
                )}

                {booking.selectedAddons && booking.selectedAddons.length > 0 && (
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '14px' }}>Official Merchandise & Pass Add-ons</td>
                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                      {booking.selectedAddons.map(id => {
                        const match = ADDONS.find(a => a.id === id);
                        return match ? match.name : id;
                      }).join(', ')}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right', fontWeight: 600 }}>
                      ₹{booking.pricing.addonsTotal.toLocaleString()}
                    </td>
                  </tr>
                )}

                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px' }}>Festival Amenities & Tax (18%)</td>
                  <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>Government & Infrastructure Levy</td>
                  <td style={{ padding: '14px', textAlign: 'right', fontWeight: 600 }}>
                    ₹{booking.pricing.tax.toLocaleString()}
                  </td>
                </tr>

                <tr>
                  <td colSpan={2} style={{ padding: '18px 14px', fontWeight: 800, fontSize: '1.15rem' }}>
                    Grand Total Delegate Fee:
                  </td>
                  <td style={{ padding: '18px 14px', textAlign: 'right', fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent-primary)' }}>
                    ₹{booking.pricing.totalPrice.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Status Bar (Item 7) */}
          <div style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            padding: '18px 24px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent-primary-light)',
            border: '1px solid var(--accent-primary)'
          }}>
            <div>
              <span style={{ fontSize: '0.84rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--accent-primary)' }}>
                Payment Method (Item 7): {booking.paymentMethod === 'online' ? 'Online Mode' : 'Campus Cash Helpdesk'}
              </span>
              <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                Transaction Ref: {booking.transactionId}
              </div>
            </div>

            <div className="badge badge-sage" style={{ fontSize: '0.92rem', padding: '8px 16px' }}>
              Status: {booking.bookingStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="btn-no-print" style={{ 
        display: 'flex', 
        justify: 'center', 
        gap: '20px', 
        marginTop: '40px' 
      }}>
        <button className="btn btn-outline btn-lg" onClick={() => navigateTo('dashboard')}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <button className="btn btn-secondary btn-lg" onClick={onOpenAllBookings}>
          <Ticket size={20} /> View All My Registrations
        </button>

        <button className="btn btn-primary btn-lg" onClick={handlePrint}>
          <Printer size={20} /> Print / Download Official Fest Pass
        </button>
      </div>
    </div>
  );
}
