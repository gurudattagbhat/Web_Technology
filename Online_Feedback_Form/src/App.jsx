import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FeedbackForm from './components/FeedbackForm';
import AnalyticsReport from './components/AnalyticsReport';
import Toast from './components/Toast';

export default function App() {
  const [activeTab, setActiveTab] = useState('form');
  const [dbStatus, setDbStatus] = useState({ connected: false, mode: 'Checking...' });
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check MongoDB connection status on startup
  const checkDbStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      if (data.success && data.db) {
        setDbStatus(data.db);
      }
    } catch (err) {
      setDbStatus({ connected: false, mode: 'Backend Offline' });
    }
  };

  useEffect(() => {
    checkDbStatus();
    const interval = setInterval(checkDbStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleFeedbackSubmitted = () => {
    // Automatically switch or notify user
    setActiveTab('report');
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} dbStatus={dbStatus} />

      <main>
        {activeTab === 'form' ? (
          <FeedbackForm onSubmitted={handleFeedbackSubmitted} addToast={addToast} />
        ) : (
          <AnalyticsReport addToast={addToast} />
        )}
      </main>

      {/* Toast Notification Container */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
