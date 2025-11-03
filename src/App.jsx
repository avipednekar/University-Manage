import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import DepartmentPage from './pages/DepartmentPage';
import HostelPage from './pages/HostelPage';
import InstructorPage from './pages/InstructorPage';
import StudentPage from './pages/StudentPage';
import CoursePage from './pages/CoursePage';
import ClassroomPage from './pages/ClassroomPage';
import EnrollmentPage from './pages/EnrollmentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="departments" element={<DepartmentPage />} />
          <Route path="hostels" element={<HostelPage />} />
          <Route path="instructors" element={<InstructorPage />} />
          <Route path="students" element={<StudentPage />} />
          <Route path="courses" element={<CoursePage />} />
          <Route path="classrooms" element={<ClassroomPage />} />
          <Route path="enrollments" element={<EnrollmentPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
