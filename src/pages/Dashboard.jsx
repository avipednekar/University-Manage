import React from 'react';
import { FaBuilding, FaHotel, FaChalkboardTeacher, FaUserGraduate, FaBook, FaDoorOpen } from 'react-icons/fa';

const Dashboard = () => {
  const stats = [
    { icon: <FaBuilding />, label: 'Departments', count: 0, color: '#2563eb' },
    { icon: <FaHotel />, label: 'Hostels', count: 0, color: '#10b981' },
    { icon: <FaChalkboardTeacher />, label: 'Instructors', count: 0, color: '#f59e0b' },
    { icon: <FaUserGraduate />, label: 'Students', count: 0, color: '#ef4444' },
    { icon: <FaBook />, label: 'Courses', count: 0, color: '#8b5cf6' },
    { icon: <FaDoorOpen />, label: 'Classrooms', count: 0, color: '#06b6d4' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Welcome to University Management System</p>
      </div>

      <div className="grid-3">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                fontSize: '40px', 
                color: stat.color,
                background: `${stat.color}20`,
                padding: '16px',
                borderRadius: '12px'
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b' }}>
                  {stat.count}
                </div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;