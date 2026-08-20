import React, { useState } from 'react';
import { X, Search, Calendar, MapPin, Ticket, ArrowRight, Trash2, CheckCircle2 } from 'lucide-react';

export default function BookingsListModal({ isOpen, onClose, bookings, onViewBooking, onDeleteBooking }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  if (!isOpen) return null;

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.eventTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.venueName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || b.paymentMethod === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      backgroundColor: 'rgba(26, 38, 33, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px'
    }}>
      <div className="card animate-slide-up" style={{
        width: '100%',
        maxWidth: '1050px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Ticket color="var(--accent-primary)" size={26} />
            <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Registered Event Bookings ({bookings.length})</h3>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '6px'
            }}
          >
            <X size={26} />
          </button>
        </div>

        {/* Filter & Search Controls */}
        <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '16px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              className="form-input"
              style={{ paddingLeft: '44px' }}
              placeholder="Search by Booking Ref, Name, Venue or Event Type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="form-select"
            style={{ width: '200px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Payments</option>
            <option value="online">Online Paid</option>
            <option value="cash">Cash on Venue</option>
          </select>
        </div>

        {/* Bookings List */}
        <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-secondary)' }}>
              No registered bookings found matching your search.
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div 
                key={b.id} 
                style={{
                  padding: '22px 28px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '20px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--accent-primary)' }}>{b.id}</strong>
                    <span className="badge badge-emerald" style={{ fontSize: '0.78rem' }}>
                      {b.eventTypeName}
                    </span>
                    <span className="badge badge-sage" style={{ fontSize: '0.78rem' }}>
                      {b.paymentMethod === 'online' ? 'Paid Online' : 'Cash Deposit'}
                    </span>
                  </div>

                  <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '6px' }}>
                    {b.customerName} ({b.phone})
                  </div>

                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', gap: '20px' }}>
                    <span><MapPin size={13} inline /> {b.venueName}</span>
                    <span><Calendar size={13} inline /> {b.eventDate} ({b.startTime} - {b.endTime})</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Amount</span>
                    <div style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: '1.2rem' }}>
                      ₹{b.pricing.totalPrice.toLocaleString()}
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      onViewBooking(b);
                      onClose();
                    }}
                  >
                    View Ticket <ArrowRight size={14} />
                  </button>

                  <button 
                    title="Delete Record"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '8px'
                    }}
                    onClick={() => onDeleteBooking(b.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
