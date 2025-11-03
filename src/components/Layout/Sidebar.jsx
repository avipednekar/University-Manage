import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaBuilding, FaHotel, FaChalkboardTeacher, FaUserGraduate, FaBook, FaDoorOpen, FaClipboardList } from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/departments', icon: <FaBuilding />, label: 'Departments' },
    { path: '/hostels', icon: <FaHotel />, label: 'Hostels & Rooms' },
    { path: '/instructors', icon: <FaChalkboardTeacher />, label: 'Instructors' },
    { path: '/students', icon: <FaUserGraduate />, label: 'Students' },
    { path: '/courses', icon: <FaBook />, label: 'Courses & Sections' },
    { path: '/classrooms', icon: <FaDoorOpen />, label: 'Classrooms & Exams' },
    { path: '/enrollments', icon: <FaClipboardList />, label: 'Enrollments' },
  ];

  const sidebarStyle = {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    width: isOpen ? '250px' : '70px',
    background: '#fff',
    borderRight: '1px solid #e2e8f0',
    transition: 'width 0.3s',
    zIndex: 1000,
    overflowX: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  };

  const headerStyle = {
    padding: '20px',
    borderBottom: '1px solid #e2e8f0',
    background: 'linear-gradient(135deg, #2563eb, #1e40af)',
    color: 'white',
    fontSize: '20px',
    fontWeight: '700',
    textAlign: 'center'
  };

  const linkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '14px 20px',
    color: isActive ? '#2563eb' : '#64748b',
    textDecoration: 'none',
    transition: 'all 0.3s',
    gap: '12px',
    borderLeft: isActive ? '3px solid #2563eb' : '3px solid transparent',
    background: isActive ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
    fontWeight: isActive ? '600' : '400'
  });

  return (
    <aside style={sidebarStyle}>
      <div style={headerStyle}>
        {isOpen ? 'University MS' : 'UMS'}
      </div>
      <nav style={{ padding: '20px 0' }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => linkStyle(isActive)}
            title={item.label}
          >
            <span style={{ fontSize: '20px', minWidth: '20px' }}>{item.icon}</span>
            {isOpen && <span style={{ fontSize: '14px' }}>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;