import React from 'react';
import BackendStatus from '../components/BackendStatus';

const HomePage = () => {
  return (
    <main className="main-content">
      <div className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="app-heading">Mini Support Ticket Manager</h1>
          <p className="app-subtitle">Manage and track your support requests.</p>
        </section>

        {/* Overview & Architecture Cards */}
        <div className="grid grid-2">
          {/* Architecture Status */}
          <div className="card">
            <h3 className="card-title">Phase 1 Architecture</h3>
            <p className="card-text">
              Initial MERN stack project architecture initialized with clean separation of concerns.
            </p>
            <ul className="feature-list">
              <li className="feature-item">
                <span className="feature-check">&#10003;</span> React + Vite frontend configured
              </li>
              <li className="feature-item">
                <span className="feature-check">&#10003;</span> Express backend &amp; middleware configured
              </li>
              <li className="feature-item">
                <span className="feature-check">&#10003;</span> GET /api/health endpoint implemented
              </li>
              <li className="feature-item">
                <span className="feature-check">&#10003;</span> Scalable modular directory architecture
              </li>
            </ul>
          </div>

          {/* Backend Connectivity Status */}
          <BackendStatus />
        </div>
      </div>
    </main>
  );
};

export default HomePage;

