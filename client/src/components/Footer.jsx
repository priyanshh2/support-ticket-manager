import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} Mini Support Ticket Manager &bull; MERN Stack Application
        </p>
      </div>
    </footer>
  );
};

export default Footer;

