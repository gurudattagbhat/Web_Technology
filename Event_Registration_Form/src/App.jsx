import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import RegistrationForm from './components/RegistrationForm';
import BookingStatus from './components/BookingStatus';
import BookingsListModal from './components/BookingsListModal';
import { INITIAL_BOOKINGS } from './data/eventData';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'register' | 'status'
  
  // Pre-select params when coming from Dashboard cards
  const [registrationParams, setRegistrationParams] = useState({
    venueId: null,
    eventType: null
  });

  // Bookings list state with localStorage sync
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('event_registrations_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return INITIAL_BOOKINGS;
  });

  // Active view booking for Status Page
  const [activeBooking, setActiveBooking] = useState(() => bookings[0] || null);

  // Modal State
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);

  // Toast Notice State
  const [toastMessage, setToastMessage] = useState('');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('event_registrations_v1', JSON.stringify(bookings));
    } catch (e) {
      console.warn('Failed to save bookings:', e);
    }
  }, [bookings]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // Navigation Handler
  const navigateTo = (view, params = {}) => {
    setActiveView(view);
    if (params.venueId || params.eventType) {
      setRegistrationParams({
        venueId: params.venueId || null,
        eventType: params.eventType || null
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pre-select venue from Dashboard card
  const handleSelectVenue = (venueId) => {
    setRegistrationParams((prev) => ({ ...prev, venueId }));
    setActiveView('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // New Booking Submitted Handler
  const handleBookingSubmit = (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setActiveBooking(newBooking);
    setActiveView('status');
    showToast(`🎉 Registration Confirmed! Reference ID: ${newBooking.id}`);
  };

  // Delete Booking Handler
  const handleDeleteBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    showToast(`Booking ${id} deleted.`);
  };

  // View specific booking details
  const handleViewBookingDetails = (bookingObj) => {
    setActiveBooking(bookingObj);
    setActiveView('status');
  };

  return (
    <div className="app-container">
      {/* Warm Ambient Background Blobs */}
      <div className="ambient-bg">
        <div className="ambient-blob-1" />
        <div className="ambient-blob-2" />
      </div>

      {/* Navigation Header */}
      <Header 
        activeView={activeView}
        navigateTo={navigateTo}
        bookingsCount={bookings.length}
        onOpenBookingsModal={() => setIsBookingsModalOpen(true)}
      />

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {activeView === 'dashboard' && (
          <Dashboard 
            navigateTo={navigateTo}
            onSelectVenue={handleSelectVenue}
            recentBookings={bookings}
            onViewBookingDetails={handleViewBookingDetails}
          />
        )}

        {activeView === 'register' && (
          <RegistrationForm 
            initialVenueId={registrationParams.venueId}
            initialEventType={registrationParams.eventType}
            onSubmitBooking={handleBookingSubmit}
            onCancel={() => setActiveView('dashboard')}
          />
        )}

        {activeView === 'status' && (
          <BookingStatus 
            booking={activeBooking}
            navigateTo={navigateTo}
            onOpenAllBookings={() => setIsBookingsModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: '30px 0',
        marginTop: 'auto'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <strong style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              Celebration<span style={{ color: 'var(--accent-terracotta)' }}>Hub</span>
            </strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Complete Event Registration, Location Booking & Pricing Estimation System
            </p>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            © 2026 CelebrationHub. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Bookings Search & Filter Modal */}
      <BookingsListModal 
        isOpen={isBookingsModalOpen}
        onClose={() => setIsBookingsModalOpen(false)}
        bookings={bookings}
        onViewBooking={handleViewBookingDetails}
        onDeleteBooking={handleDeleteBooking}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="toast-notice">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
