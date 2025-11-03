import React from 'react';
import { FaBars, FaUser } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  const navStyle = {
    height: '64px',
    background: '#fff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '8px',
    color: '#64748b'
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button style={buttonStyle} onClick={toggleSidebar}>
          <FaBars />
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>
          University Management System
        </h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
        <FaUser />
        <span>Admin</span>
      </div>
    </nav>
  );
};

export default Navbar;