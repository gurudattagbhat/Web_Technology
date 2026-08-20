import React from 'react';
import { Sparkles, Ticket, PlusCircle, GraduationCap } from 'lucide-react';
import { COLLEGE_FEST_INFO } from '../data/eventData';

export default function Header({ activeView, navigateTo, bookingsCount, onOpenBookingsModal }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '16px 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Alliance ONE College Brand Logo */}
        <div 
          onClick={() => navigateTo('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-gold) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(45, 106, 79, 0.3)'
          }}>
            <GraduationCap size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                fontFamily: 'var(--font-heading)', 
                fontWeight: 800, 
                fontSize: '1.5rem', 
                color: 'var(--text-primary)',
                letterSpacing: '-0.5px'
              }}>
                Alliance <span style={{ color: 'var(--accent-primary)' }}>ONE</span> 2026
              </span>
              <span className="badge badge-gold" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                Annual Fest
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {COLLEGE_FEST_INFO.universityName} • Inter-College Registration Portal
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            className={`btn ${activeView === 'dashboard' ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => navigateTo('dashboard')}
          >
            Fest Dashboard
          </button>

          <button 
            className="btn btn-outline"
            onClick={onOpenBookingsModal}
            style={{ position: 'relative' }}
          >
            <Ticket size={18} />
            My Registrations
            {bookingsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: 'var(--accent-primary)',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {bookingsCount}
              </span>
            )}
          </button>

          <button 
            className="btn btn-primary"
            onClick={() => navigateTo('register')}
          >
            <PlusCircle size={18} />
            Register for Events
          </button>
        </nav>
      </div>
    </header>
  );
}
