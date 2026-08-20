import React from 'react';
import { ClipboardList, BarChart3, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, dbStatus }) {
  return (
    <header className="glass-card-sm no-print" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <ClipboardList size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, color: '#0f172a' }}>
              Online Feedback Portal
            </h1>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
              Student Course & Faculty Feedback System
            </p>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
            id="tab-submit-feedback"
          >
            <ClipboardList size={16} />
            Feedback Form
          </button>
          <button
            className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
            id="tab-analytics-report"
          >
            <BarChart3 size={16} />
            Generated Reports
          </button>
        </div>

        {/* DB Connection Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {dbStatus.connected ? (
            <div className="badge badge-emerald" title={`Connected mode: ${dbStatus.mode}`}>
              <CheckCircle2 size={13} />
              <span>MongoDB Connected</span>
            </div>
          ) : (
            <div className="badge badge-amber" title="Connecting to database">
              <AlertTriangle size={13} />
              <span>MongoDB Connecting...</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
