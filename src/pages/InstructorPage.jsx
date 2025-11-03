import React, { useState, useEffect } from 'react';
import { instructorAPI, departmentAPI, hostelAPI, hostelAdminAPI } from '../api/api';
import Modal from '../components/Common/Modal';
import { FaPlus, FaEdit, FaTrash, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';

const InstructorPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [hostelAdmins, setHostelAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [instructorForm, setInstructorForm] = useState({ 
    instructor_id: '', name: '', dept_name: '', salary: '' 
  });
  const [adminForm, setAdminForm] = useState({ instructor_id: '', hostel_id: '' });
  const [activeTab, setActiveTab] = useState('instructors');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [instructorsRes, deptsRes, hostelsRes, adminsRes] = await Promise.all([
        instructorAPI.getAll(),
        departmentAPI.getAll(),
        hostelAPI.getAll(),
        hostelAdminAPI.getAll()
      ]);
      setInstructors(instructorsRes.data);
      setDepartments(deptsRes.data);
      setHostels(hostelsRes.data);
      setHostelAdmins(adminsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInstructorSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInstructor) {
        await instructorAPI.update(editingInstructor.instructor_id, instructorForm);
      } else {
        await instructorAPI.create(instructorForm);
      }
      fetchData();
      handleCloseInstructorModal();
    } catch (error) {
      console.error('Error saving instructor:', error);
      alert('Failed to save instructor');
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      await hostelAdminAPI.create(adminForm);
      fetchData();
      handleCloseAdminModal();
    } catch (error) {
      console.error('Error assigning hostel admin:', error);
      alert('Failed to assign hostel admin');
    }
  };

  const handleDeleteInstructor = async (id) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        await instructorAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting instructor:', error);
        alert('Failed to delete instructor');
      }
    }
  };

  const handleDeleteAdmin = async (instructorId, hostelId) => {
    if (window.confirm('Remove this hostel admin assignment?')) {
      try {
        await hostelAdminAPI.delete(instructorId, hostelId);
        fetchData();
      } catch (error) {
        console.error('Error removing admin:', error);
        alert('Failed to remove admin');
      }
    }
  };

  const handleEditInstructor = (instructor) => {
    setEditingInstructor(instructor);
    setInstructorForm({
      instructor_id: instructor.instructor_id,
      name: instructor.name,
      dept_name: instructor.dept_name,
      salary: instructor.salary
    });
    setShowInstructorModal(true);
  };

  const handleCloseInstructorModal = () => {
    setShowInstructorModal(false);
    setEditingInstructor(null);
    setInstructorForm({ instructor_id: '', name: '', dept_name: '', salary: '' });
  };

  const handleCloseAdminModal = () => {
    setShowAdminModal(false);
    setAdminForm({ instructor_id: '', hostel_id: '' });
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Instructor Management</h1>
        <p className="page-description">Manage instructors and hostel admins</p>
      </div>

      <div style={{ marginBottom: '20px', borderBottom: '2px solid #e2e8f0' }}>
        <button 
          onClick={() => setActiveTab('instructors')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'instructors' ? '#2563eb' : 'transparent',
            color: activeTab === 'instructors' ? 'white' : '#64748b',
            fontWeight: '600',
            cursor: 'pointer',
            borderRadius: '6px 6px 0 0',
            marginRight: '8px'
          }}
        >
          <FaChalkboardTeacher style={{ marginRight: '8px' }} />
          Instructors
        </button>
        <button 
          onClick={() => setActiveTab('admins')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'admins' ? '#2563eb' : 'transparent',
            color: activeTab === 'admins' ? 'white' : '#64748b',
            fontWeight: '600',
            cursor: 'pointer',
            borderRadius: '6px 6px 0 0'
          }}
        >
          <FaUserShield style={{ marginRight: '8px' }} />
          Hostel Admins
        </button>
      </div>

      {activeTab === 'instructors' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Instructors</h2>
            <button className="btn btn-primary" onClick={() => setShowInstructorModal(true)}>
              <FaPlus /> Add Instructor
            </button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {instructors.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                      No instructors found. Add your first instructor!
                    </td>
                  </tr>
                ) : (
                  instructors.map((instructor) => (
                    <tr key={instructor.instructor_id}>
                      <td>{instructor.instructor_id}</td>
                      <td>{instructor.name}</td>
                      <td><span className="badge badge-primary">{instructor.dept_name}</span></td>
                      <td>${instructor.salary?.toLocaleString()}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-sm btn-primary" onClick={() => handleEditInstructor(instructor)}>
                            <FaEdit />
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteInstructor(instructor.instructor_id)}>
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'admins' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Hostel Admin Assignments</h2>
            <button className="btn btn-primary" onClick={() => setShowAdminModal(true)}>
              <FaPlus /> Assign Admin
            </button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Instructor</th>
                  <th>Hostel</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hostelAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>
                      No hostel admins assigned yet!
                    </td>
                  </tr>
                ) : (
                  hostelAdmins.map((admin, index) => (
                    <tr key={index}>
                      <td>{instructors.find(i => i.instructor_id === admin.instructor_id)?.name || 'N/A'}</td>
                      <td>{hostels.find(h => h.hostel_id === admin.hostel_id)?.hostel_name || 'N/A'}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-danger" 
                          onClick={() => handleDeleteAdmin(admin.instructor_id, admin.hostel_id)}
                        >
                          <FaTrash /> Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Instructor Modal */}
      <Modal
        isOpen={showInstructorModal}
        onClose={handleCloseInstructorModal}
        title={editingInstructor ? 'Edit Instructor' : 'Add New Instructor'}
        footer={
          <>
            <button className="btn" onClick={handleCloseInstructorModal}>Cancel</button>
            <button className="btn btn-primary" onClick={handleInstructorSubmit}>
              {editingInstructor ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <form onSubmit={handleInstructorSubmit}>
          <div className="form-group">
            <label className="form-label required">Instructor ID</label>
            <input
              type="text"
              className="form-input"
              value={instructorForm.instructor_id}
              onChange={(e) => setInstructorForm({ ...instructorForm, instructor_id: e.target.value })}
              required
              disabled={editingInstructor}
            />
          </div>
          <div className="form-group">
            <label className="form-label required">Name</label>
            <input
              type="text"
              className="form-input"
              value={instructorForm.name}
              onChange={(e) => setInstructorForm({ ...instructorForm, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label required">Department</label>
            <select
              className="form-select"
              value={instructorForm.dept_name}
              onChange={(e) => setInstructorForm({ ...instructorForm, dept_name: e.target.value })}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.dept_name} value={dept.dept_name}>
                  {dept.dept_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label required">Salary</label>
            <input
              type="number"
              className="form-input"
              value={instructorForm.salary}
              onChange={(e) => setInstructorForm({ ...instructorForm, salary: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Hostel Admin Modal */}
      <Modal
        isOpen={showAdminModal}
        onClose={handleCloseAdminModal}
        title="Assign Hostel Admin"
        footer={
          <>
            <button className="btn" onClick={handleCloseAdminModal}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdminSubmit}>
              Assign
            </button>
          </>
        }
      >
        <form onSubmit={handleAdminSubmit}>
          <div className="form-group">
            <label className="form-label required">Instructor</label>
            <select
              className="form-select"
              value={adminForm.instructor_id}
              onChange={(e) => setAdminForm({ ...adminForm, instructor_id: e.target.value })}
              required
            >
              <option value="">Select Instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor.instructor_id} value={instructor.instructor_id}>
                  {instructor.name} ({instructor.instructor_id})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label required">Hostel</label>
            <select
              className="form-select"
              value={adminForm.hostel_id}
              onChange={(e) => setAdminForm({ ...adminForm, hostel_id: e.target.value })}
              required
            >
              <option value="">Select Hostel</option>
              {hostels.map((hostel) => (
                <option key={hostel.hostel_id} value={hostel.hostel_id}>
                  {hostel.hostel_name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InstructorPage;