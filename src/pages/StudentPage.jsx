import React, { useState, useEffect } from 'react';
import { studentAPI, departmentAPI, hostelAPI, roomAPI } from '../api/api';
import Modal from '../components/Common/Modal';
import { FaPlus, FaEdit, FaTrash, FaUserGraduate } from 'react-icons/fa';

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    dept_name: '',
    // tot_cred: '', // Removed: Not in new schema
    hostel_id: '',
    room_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.hostel_id) {
      // This logic remains valid as backend route provides hostel_id
      const filtered = rooms.filter(room => room.hostel_id === parseInt(formData.hostel_id));
      setFilteredRooms(filtered);
    } else {
      setFilteredRooms([]);
    }
  }, [formData.hostel_id, rooms]);

  const fetchData = async () => {
    try {
      const [studentsRes, deptsRes, hostelsRes, roomsRes] = await Promise.all([
        studentAPI.getAll(),
        departmentAPI.getAll(),
        hostelAPI.getAll(),
        roomAPI.getAll()
      ]);
      setStudents(studentsRes.data);
      setDepartments(deptsRes.data);
      setHostels(hostelsRes.data);
      setRooms(roomsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentAPI.update(editingStudent.student_id, formData);
      } else {
        await studentAPI.create(formData);
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student');
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      student_id: student.student_id,
      name: student.name,
      dept_name: student.dept_name,
      // tot_cred: student.tot_cred, // Removed
      hostel_id: student.hostel_id || '',
      room_id: student.room_id || '' // This is now the synthetic key 'hostel_id-room_number'
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setFormData({
      student_id: '',
      name: '',
      dept_name: '',
      // tot_cred: '', // Removed
      hostel_id: '',
      room_id: ''
    });
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Student Management</h1>
        <p className="page-description">Manage all student records</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Students</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> Add Student
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Department</th>
                {/* <th>Credits</th> Removed */}
                <th>Hostel</th>
                <th>Room</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}> {/* Adjusted colSpan */}
                    No students found. Add your first student!
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.student_id}>
                    <td>{student.student_id}</td>
                    <td>{student.name}</td>
                    <td><span className="badge badge-primary">{student.dept_name}</span></td>
                    {/* <td>{student.tot_cred}</td> Removed */}
                    <td>{hostels.find(h => h.hostel_id === student.hostel_id)?.hostel_name || '-'}</td>
                    {/* Backend now provides synthetic room_id, this find will work */}
                    <td>{rooms.find(r => r.room_id === student.room_id)?.room_number || '-'}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-sm btn-primary" onClick={() => handleEdit(student)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(student.student_id)}>
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

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
        footer={
          <>
            <button className="btn" onClick={handleCloseModal}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingStudent ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label required">Student ID</label>
              <input
                type="number" // Changed to number to match new schema (student_ID INT)
                className="form-input"
                value={formData.student_id}
                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                required
                disabled={editingStudent}
              />
            </div>
            <div className="form-group">
              <label className="form-label required">Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name} // This will map to first_name on backend
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label required">Department</label>
              <select
                className="form-select"
                value={formData.dept_name}
                onChange={(e) => setFormData({ ...formData, dept_name: e.target.value })}
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
            {/* <div className="form-group">
              <label className="form-label required">Total Credits</label>
              <input
                type="number"
                className="form-input"
                value={formData.tot_cred}
                onChange={(e) => setFormData({ ...formData, tot_cred: e.target.value })}
                required
                min="0"
              />
            </div> Removed */}
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Hostel</label>
              <select
                className="form-select"
                value={formData.hostel_id}
                onChange={(e) => setFormData({ ...formData, hostel_id: e.target.value, room_id: '' })}
              >
                <option value="">Select Hostel (Optional)</option>
                {hostels.map((hostel) => (
                  <option key={hostel.hostel_id} value={hostel.hostel_id}>
                    {hostel.hostel_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Room</label>
              <select
                className="form-select"
                value={formData.room_id} // This is now the synthetic key 'hostel_id-room_number'
                onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                disabled={!formData.hostel_id}
              >
                <option value="">Select Room (Optional)</option>
                {filteredRooms.map((room) => (
                  // room.room_id is now the synthetic key
                  <option key={room.room_id} value={room.room_id}>
                    {room.room_number} ({room.room_type})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentPage;