import React, { useState, useEffect } from 'react';
import { checkHealth, API_BASE_URL } from '../services/api';

const BackendStatus = () => {
  const [status, setStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
  const [message, setMessage] = useState('Verifying connection...');

  const fetchStatus = async () => {
    setStatus('checking');
    setMessage('Connecting to backend...');
    try {
      const data = await checkHealth();
      if (data && data.success) {
        setStatus('online');
        setMessage(data.message || 'Server is running successfully');
      } else {
        setStatus('offline');
        setMessage('Unexpected response from server');
      }
    } catch (err) {
      setStatus('offline');
      setMessage('Unable to connect to backend server');
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="card">
      <h3 className="card-title">
        <span>Backend Health Status</span>
      </h3>
      <p className="card-text">
        Verifies connectivity between the React frontend and Express backend.
      </p>

      <div className="status-container">
        <div className="status-info">
          <span className="status-label">Target Endpoint</span>
          <span className="status-value">{API_BASE_URL}/health</span>
        </div>
        <div>
          {status === 'checking' && (
            <span className="badge badge-warning">
              <span className="status-dot"></span> Checking
            </span>
          )}
          {status === 'online' && (
            <span className="badge badge-success">
              <span className="status-dot"></span> Online
            </span>
          )}
          {status === 'offline' && (
            <span className="badge badge-warning" style={{ color: '#ef4444', backgroundColor: '#fef2f2' }}>
              <span className="status-dot"></span> Offline
            </span>
          )}
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{message}</span>
        <button onClick={fetchStatus} className="btn btn-outline" style={{ padding: '0.25rem 0.65rem', fontSize: '0.8rem' }}>
          Refresh
        </button>
      </div>
    </div>
  );
};

export default BackendStatus;

