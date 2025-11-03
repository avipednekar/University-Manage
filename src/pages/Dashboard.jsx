import React, { useState, useEffect } from 'react'; // Import hooks
import { FaBuilding, FaHotel, FaChalkboardTeacher, FaUserGraduate, FaBook, FaDoorOpen } from 'react-icons/fa';
import { statsAPI } from '../api/api'; // Import the new API

const Dashboard = () => {
  // Set up state to hold the counts
  const [statsData, setStatsData] = useState({
    departments: 0,
    hostels: 0,
    instructors: 0,
    students: 0,
    courses: 0,
    classrooms: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsAPI.getStats();
        setStatsData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); // The empty array ensures this runs only once on mount

  // Define the stats array *inside* the component
  // so it can access the 'statsData' state
  const stats = [
    { icon: <FaBuilding />, label: 'Departments', count: statsData.departments, color: '#2563eb' },
    { icon: <FaHotel />, label: 'Hostels', count: statsData.hostels, color: '#10b981' },
    { icon: <FaChalkboardTeacher />, label: 'Instructors', count: statsData.instructors, color: '#f59e0b' },
    { icon: <FaUserGraduate />, label: 'Students', count: statsData.students, color: '#ef4444' },
    { icon: <FaBook />, label: 'Courses', count: statsData.courses, color: '#8b5cf6' },
    { icon: <FaDoorOpen />, label: 'Classrooms', count: statsData.classrooms, color: '#06b6d4' },
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
                  {/* Show a small spinner while loading, then the count */}
                  {loading ? <div className="spinner" style={{width: 30, height: 30, margin: 0}}></div> : stat.count}
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