import React from 'react';

const Header = ({ onCreateClick }) => {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-text">
        <h1 className="app-heading">Mini Support Ticket Manager</h1>
        <p className="app-subtitle">Manage and track your support requests.</p>
      </div>
      <div className="dashboard-header-action">
        <button
          type="button"
          className="btn btn-primary btn-create"
          onClick={onCreateClick}
          aria-label="Create new ticket"
        >
          <span className="btn-icon">+</span> Create Ticket
        </button>
      </div>
    </header>
  );
};

export default Header;

