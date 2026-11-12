import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <Dashboard />
      <Footer />
    </div>
  );
}

export default App;
