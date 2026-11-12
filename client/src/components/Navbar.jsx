import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="brand-wrapper">
          <div className="brand-icon">ST</div>
          <span className="brand-title">Mini Support Ticket Manager</span>
        </div>
        <div>
          <span className="badge badge-phase">
            <span className="status-dot"></span>
            Phase 4: Full-Stack Integrated
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
