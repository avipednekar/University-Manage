import React, { useState, useEffect } from 'react';
import { classroomAPI, timeSlotAPI, examAPI } from '../api/api';
import Modal from '../components/Common/Modal';
import { FaPlus, FaEdit, FaTrash, FaDoorOpen, FaClock, FaFileAlt } from 'react-icons/fa';

const ClassroomPage = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClassroomModal, setShowClassroomModal] = useState(false);
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [editingTimeSlot, setEditingTimeSlot] = useState(null);
  const [editingExam, setEditingExam] = useState(null);
  const [classroomForm, setClassroomForm] = useState({ building: '', room_number: '', capacity: '' });
  const [timeSlotForm, setTimeSlotForm] = useState({ time_slot_id: '', day: '', start_time: '', end_time: '' });
  // Updated examForm state for new schema
  const [examForm, setExamForm] = useState({ exam_id: '', exam_date: '', room_number: '' });
  const [activeTab, setActiveTab] = useState('classrooms');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [c, t, e] = await Promise.all([
        classroomAPI.getAll(),
        timeSlotAPI.getAll(),
        examAPI.getAll()
      ]);
      setClassrooms(c.data);
      setTimeSlots(t.data);
      setExams(e.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClassroomSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClassroom) {
        await classroomAPI.update(editingClassroom.building, editingClassroom.room_number, classroomForm);
      } else {
        await classroomAPI.create(classroomForm);
      }
      fetchData();
      setShowClassroomModal(false);
      setEditingClassroom(null);
      setClassroomForm({ building: '', room_number: '', capacity: '' });
    } catch (error) {
      alert('Failed to save classroom');
    }
  };

  const handleTimeSlotSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTimeSlot) {
        await timeSlotAPI.update(editingTimeSlot.time_slot_id, timeSlotForm);
      } else {
        await timeSlotAPI.create(timeSlotForm);
      }
      fetchData();
      setShowTimeSlotModal(false);
      setEditingTimeSlot(null);
      setTimeSlotForm({ time_slot_id: '', day: '', start_time: '', end_time: '' });
    } catch (error) {
      alert('Failed to save time slot');
    }
  };

  const handleExamSubmit = async (e) => {
    e.preventDefault();
    try {
      // api.js sends the full form. Backend will ignore exam_name and building.
      if (editingExam) {
        await examAPI.update(editingExam.exam_id, examForm);
      } else {
        await examAPI.create(examForm);
      }
      fetchData();
      setShowExamModal(false);
      setEditingExam(null);
      // Reset to new state
      setExamForm({ exam_id: '', exam_date: '', room_number: '' });
    } catch (error) {
      alert('Failed to save exam');
    }
  };

  const handleDeleteClassroom = async (building, room) => {
    if (window.confirm('Delete this classroom?')) {
      try {
        await classroomAPI.delete(building, room);
        fetchData();
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  const handleDeleteTimeSlot = async (id) => {
    if (window.confirm('Delete this time slot?')) {
      try {
        await timeSlotAPI.delete(id);
        fetchData();
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm('Delete this exam?')) {
      try {
        await examAPI.delete(id);
        fetchData();
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Classroom, Time Slot & Exam Management</h1>
        <p className="page-description">Manage classrooms, time slots, and exams</p>
      </div>

      <div style={{ marginBottom: '20px', borderBottom: '2px solid #e2e8f0' }}>
        <button onClick={() => setActiveTab('classrooms')} style={{
          padding: '12px 24px', border: 'none',
          background: activeTab === 'classrooms' ? '#2563eb' : 'transparent',
          color: activeTab === 'classrooms' ? 'white' : '#64748b',
          fontWeight: '600', cursor: 'pointer', borderRadius: '6px 6px 0 0', marginRight: '8px'
        }}>
          <FaDoorOpen style={{ marginRight: '8px' }} />Classrooms
        </button>
        <button onClick={() => setActiveTab('timeslots')} style={{
          padding: '12px 24px', border: 'none',
          background: activeTab === 'timeslots' ? '#2563eb' : 'transparent',
          color: activeTab === 'timeslots' ? 'white' : '#64748b',
          fontWeight: '600', cursor: 'pointer', borderRadius: '6px 6px 0 0', marginRight: '8px'
        }}>
          <FaClock style={{ marginRight: '8px' }} />Time Slots
        </button>
        <button onClick={() => setActiveTab('exams')} style={{
          padding: '12px 24px', border: 'none',
          background: activeTab === 'exams' ? '#2563eb' : 'transparent',
          color: activeTab === 'exams' ? 'white' : '#64748b',
          fontWeight: '600', cursor: 'pointer', borderRadius: '6px 6px 0 0'
        }}>
          <FaFileAlt style={{ marginRight: '8px' }} />Exams
        </button>
      </div>

      {activeTab === 'classrooms' && (
        // This tab is unchanged
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Classrooms</h2>
            <button className="btn btn-primary" onClick={() => setShowClassroomModal(true)}>
              <FaPlus /> Add Classroom
            </button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Building</th><th>Room Number</th><th>Capacity</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {classrooms.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                    No classrooms found. Add your first classroom!
                  </td></tr>
                ) : (
                  classrooms.map((c) => (
                    <tr key={`${c.building}-${c.room_number}`}>
                      <td>{c.building}</td>
                      <td>{c.room_number}</td>
                      <td>{c.capacity}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-sm btn-primary" onClick={() => {
                            setEditingClassroom(c);
                            setClassroomForm(c);
                            setShowClassroomModal(true);
                          }}><FaEdit /></button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClassroom(c.building, c.room_number)}>
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

      {activeTab === 'timeslots' && (
        // This tab is unchanged
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Time Slots</h2>
            <button className="btn btn-primary" onClick={() => setShowTimeSlotModal(true)}>
              <FaPlus /> Add Time Slot
            </button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Time Slot ID</th><th>Day</th><th>Start Time</th><th>End Time</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {timeSlots.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                    No time slots found. Add your first time slot!
                  </td></tr>
                ) : (
                  timeSlots.map((t) => (
                    <tr key={t.time_slot_id}>
                      <td>{t.time_slot_id}</td>
                      <td><span className="badge badge-primary">{t.day}</span></td>
                      <td>{t.start_time}</td>
                      <td>{t.end_time}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-sm btn-primary" onClick={() => {
                            setEditingTimeSlot(t);
                            setTimeSlotForm(t);
                            setShowTimeSlotModal(true);
                          }}><FaEdit /></button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTimeSlot(t.time_slot_id)}>
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

      {activeTab === 'exams' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Exams</h2>
            <button className="btn btn-primary" onClick={() => setShowExamModal(true)}>
              <FaPlus /> Add Exam
            </button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Exam ID</th>
                  {/* <th>Exam Name</th> Removed, backend aliases ID to Name */}
                  <th>Date</th>
                  <th>Room Number</th>{/* Changed from Classroom */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}> {/* Adjusted colSpan */}
                    No exams found. Add your first exam!
                  </td></tr>
                ) : (
                  exams.map((e) => (
                    <tr key={e.exam_id}>
                      <td>{e.exam_id}</td>
                      {/* <td>{e.exam_name}</td> Backend aliases ID to name, showing both is redundant */}
                      <td>{e.exam_date}</td>
                      <td>{e.room_number}</td>{/* Changed from {e.building} {e.room_number} */}
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-sm btn-primary" onClick={() => {
                            setEditingExam(e);
                            // Map existing data to new form state
                            setExamForm({
                                exam_id: e.exam_id,
                                exam_date: e.exam_date,
                                room_number: e.room_number
                            });
                            setShowExamModal(true);
                          }}><FaEdit /></button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteExam(e.exam_id)}>
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

      {/* Classroom Modal - Unchanged */}
      <Modal isOpen={showClassroomModal} onClose={() => { setShowClassroomModal(false); setEditingClassroom(null); setClassroomForm({ building: '', room_number: '', capacity: '' }); }}
        title={editingClassroom ? 'Edit Classroom' : 'Add Classroom'}
        footer={<><button className="btn" onClick={() => setShowClassroomModal(false)}>Cancel</button>
        <button className="btn btn-primary" onClick={handleClassroomSubmit}>{editingClassroom ? 'Update' : 'Create'}</button></>}>
        <form onSubmit={handleClassroomSubmit}>
          <div className="form-group">
            <label className="form-label required">Building</label>
            <input type="text" className="form-input" value={classroomForm.building}
              onChange={(e) => setClassroomForm({ ...classroomForm, building: e.target.value })} required disabled={editingClassroom} />
          </div>
          <div className="form-group">
            <label className="form-label required">Room Number</label>
            <input type="text" className="form-input" value={classroomForm.room_number}
              onChange={(e) => setClassroomForm({ ...classroomForm, room_number: e.target.value })} required disabled={editingClassroom} />
          </div>
          <div className="form-group">
            <label className="form-label required">Capacity</label>
            <input type="number" className="form-input" value={classroomForm.capacity}
              onChange={(e) => setClassroomForm({ ...classroomForm, capacity: e.target.value })} required min="1" />
          </div>
        </form>
      </Modal>

      {/* TimeSlot Modal - Unchanged */}
      <Modal isOpen={showTimeSlotModal} onClose={() => { setShowTimeSlotModal(false); setEditingTimeSlot(null); setTimeSlotForm({ time_slot_id: '', day: '', start_time: '', end_time: '' }); }}
        title={editingTimeSlot ? 'Edit Time Slot' : 'Add Time Slot'}
        footer={<><button className="btn" onClick={() => setShowTimeSlotModal(false)}>Cancel</button>
        <button className="btn btn-primary" onClick={handleTimeSlotSubmit}>{editingTimeSlot ? 'Update' : 'Create'}</button></>}>
        <form onSubmit={handleTimeSlotSubmit}>
          <div className="form-group">
            <label className="form-label required">Time Slot ID</label>
            <input type="text" className="form-input" value={timeSlotForm.time_slot_id}
              onChange={(e) => setTimeSlotForm({ ...timeSlotForm, time_slot_id: e.target.value })} required disabled={editingTimeSlot} />
          </div>
          <div className="form-group">
            <label className="form-label required">Day</label>
            <select className="form-select" value={timeSlotForm.day}
              onChange={(e) => setTimeSlotForm({ ...timeSlotForm, day: e.target.value })} required>
              <option value="">Select Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label required">Start Time</label>
              <input type="time" className="form-input" value={timeSlotForm.start_time}
                onChange={(e) => setTimeSlotForm({ ...timeSlotForm, start_time: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label required">End Time</label>
              <input type="time" className="form-input" value={timeSlotForm.end_time}
                onChange={(e) => setTimeSlotForm({ ...timeSlotForm, end_time: e.target.value })} required />
            </div>
          </div>
        </form>
      </Modal>

      {/* Exam Modal - HEAVILY MODIFIED */}
      <Modal isOpen={showExamModal} onClose={() => { setShowExamModal(false); setEditingExam(null); setExamForm({ exam_id: '', exam_date: '', room_number: '' }); }}
        title={editingExam ? 'Edit Exam' : 'Add Exam'}
        footer={<><button className="btn" onClick={() => setShowExamModal(false)}>Cancel</button>
        <button className="btn btn-primary" onClick={handleExamSubmit}>{editingExam ? 'Update' : 'Create'}</button></>}>
        <form onSubmit={handleExamSubmit}>
          <div className="form-group">
            <label className="form-label required">Exam ID</label>
            <input type="text" className="form-input" value={examForm.exam_id}
              onChange={(e) => setExamForm({ ...examForm, exam_id: e.target.value })} required disabled={editingExam} />
          </div>
          {/* <div className="form-group">
            <label className="form-label required">Exam Name</label>
            <input type="text" className="form-input" value={examForm.exam_name}
              onChange={(e) => setExamForm({ ...examForm, exam_name: e.target.value })} required />
          </div> Removed */}
          <div className="form-group">
            <label className="form-label required">Exam Date</label>
            <input type="date" className="form-input" value={examForm.exam_date}
              onChange={(e) => setExamForm({ ...examForm, exam_date: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label required">Room Number</label>
            {/* Changed from select to simple text input */}
            <input
              type="text"
              className="form-input"
              value={examForm.room_number}
              onChange={(e) => setExamForm({ ...examForm, room_number: e.target.value })}
              required
              placeholder="Enter room number (e.g., 101)"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClassroomPage;