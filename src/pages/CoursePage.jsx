import React, { useState, useEffect } from 'react';
import { courseAPI, sectionAPI, departmentAPI, instructorAPI, classroomAPI, timeSlotAPI } from '../api/api';
import Modal from '../components/Common/Modal';
import { FaPlus, FaEdit, FaTrash, FaBook, FaUsers } from 'react-icons/fa';

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  
  const [courseForm, setCourseForm] = useState({ 
    course_id: '', title: '', duration: ''
  });
  const [sectionForm, setSectionForm] = useState({
    sec_id: '', course_id: '', semester: '', year: '', 
    building: '', room_number: '', time_slot_id: '', instructor_id: ''
  });
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, sectionsRes, deptsRes, instructorsRes, classroomsRes, timeSlotsRes] = await Promise.all([
        courseAPI.getAll(),
        sectionAPI.getAll(),
        departmentAPI.getAll(),
        instructorAPI.getAll(),
        classroomAPI.getAll(),
        timeSlotAPI.getAll()
      ]);
      setCourses(coursesRes.data);
      setSections(sectionsRes.data);
      setDepartments(deptsRes.data);
      setInstructors(instructorsRes.data);
      setClassrooms(classroomsRes.data);
      setTimeSlots(timeSlotsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      // This form state now correctly matches what the backend expects
      const dataToSend = {
          course_id: courseForm.course_id,
          title: courseForm.title,
          duration: courseForm.duration
      }

      if (editingCourse) {
        await courseAPI.update(editingCourse.course_id, dataToSend);
      } else {
        await courseAPI.create(dataToSend);
      }
      fetchData();
      handleCloseCourseModal();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    }
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSection) {
        await sectionAPI.update(editingSection.sec_id, sectionForm);
      } else {
        await sectionAPI.create(sectionForm);
      }
      fetchData();
      handleCloseSectionModal();
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Failed to save section');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure? This will delete all associated sections!')) {
      try {
        await courseAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      }
    }
  };

  const handleDeleteSection = async (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await sectionAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting section:', error);
        alert('Failed to delete section');
      }
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      course_id: course.course_id,
      title: course.title,
      // --- THIS IS NOW CORRECTED ---
      // Reads 'duration' from the backend GET route
      duration: course.duration 
    });
    setShowCourseModal(true);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setSectionForm({
      sec_id: section.sec_id,
      course_id: section.course_id,
      semester: section.semester,
      year: section.year,
      building: section.building,
      room_number: section.room_number,
      time_slot_id: section.time_slot_id,
      instructor_id: section.instructor_id
    });
  };

  const handleCloseCourseModal = () => {
    setShowCourseModal(false);
    setEditingCourse(null);
    setCourseForm({ course_id: '', title: '', duration: '' });
  };

  const handleCloseSectionModal = () => {
    setShowSectionModal(false);
    setEditingSection(null);
    setSectionForm({
      sec_id: '', course_id: '', semester: '', year: '',
      building: '', room_number: '', time_slot_id: '', instructor_id: ''
    });
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Course & Section Management</h1>
        <p className="page-description">Manage courses and their sections</p>
      </div>

      <div style={{ marginBottom: '20px', borderBottom: '2px solid #e2e8f0' }}>
        <button 
          onClick={() => setActiveTab('courses')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'courses' ? '#2563eb' : 'transparent',
            color: activeTab === 'courses' ? 'white' : '#64748b',
            fontWeight: '600',
            cursor: 'pointer',
            borderRadius: '6px 6px 0 0',
            marginRight: '8px'
          }}
        >
          <FaBook style={{ marginRight: '8px' }} />
          Courses
        </button>
        <button 
          onClick={() => setActiveTab('sections')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'sections' ? '#2563eb' : 'transparent',
            color: activeTab === 'sections' ? 'white' : '#64748b',
            fontWeight: '600',
            cursor: 'pointer',
            borderRadius: '6px 6px 0 0'
          }}
        >
          <FaUsers style={{ marginRight: '8px' }} />
          Sections
        </button>
      </div>

      {activeTab === 'courses' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Courses</h2>
            <button className="btn btn-primary" onClick={() => setShowCourseModal(true)}>
              <FaPlus /> Add Course
            </button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Title</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                      No courses found. Add your first course!
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course.course_id}>
                      <td>{course.course_id}</td>
                      <td>{course.title}</td>
                      {/* --- THIS IS NOW CORRECTED --- */}
                      <td>{course.duration}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-sm btn-primary" onClick={() => handleEditCourse(course)}>
                            <FaEdit />
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteCourse(course.course_id)}>
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

      {activeTab === 'sections' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Sections</h2>
            <button className="btn btn-primary" onClick={() => setShowSectionModal(true)}>
              <FaPlus /> Add Section
            </button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Section ID</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Year</th>
                  <th>Instructor</th>
                  <th>Classroom</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sections.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                      No sections found. Add your first section!
                    </td>
                  </tr>
                ) : (
                  sections.map((section) => (
                    <tr key={`${section.course_id}-${section.sec_id}-${section.semester}-${section.year}`}>
                      <td>{section.sec_id}</td>
                      <td>{courses.find(c => c.course_id === section.course_id)?.title || 'N/A'}</td>
                      <td><span className="badge badge-success">{section.semester}</span></td>
                      <td>{section.year}</td>
                      <td>{instructors.find(i => i.instructor_id === section.instructor_id)?.name || 'N/A'}</td>
                      <td>{section.building} {section.room_number}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-sm btn-primary" onClick={() => handleEditSection(section)}>
                            <FaEdit />
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteSection(section.sec_id)}>
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

      {/* Course Modal */}
      <Modal
        isOpen={showCourseModal}
        onClose={handleCloseCourseModal}
        title={editingCourse ? 'Edit Course' : 'Add New Course'}
        footer={
          <>
            <button className="btn" onClick={handleCloseCourseModal}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCourseSubmit}>
              {editingCourse ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCourseSubmit}>
          <div className="form-group">
            <label className="form-label required">Course ID</label>
            <input
              type="text"
              className="form-input"
              value={courseForm.course_id}
              onChange={(e) => setCourseForm({ ...courseForm, course_id: e.target.value })}
              required
              disabled={editingCourse}
            />
          </div>
          <div className="form-group">
            <label className="form-label required">Title</label>
            <input
              type="text"
              className="form-input"
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label required">Duration</label>
            <input
              type="text"
              className="form-input"
              value={courseForm.duration}
              onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Section Modal */}
      <Modal
        isOpen={showSectionModal}
        onClose={handleCloseSectionModal}
        title={editingSection ? 'Edit Section' : 'Add New Section'}
        footer={
          <>
            <button className="btn" onClick={handleCloseSectionModal}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSectionSubmit}>
              {editingSection ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSectionSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label required">Section ID</label>
              <input
                type="text"
                className="form-input"
                value={sectionForm.sec_id}
                onChange={(e) => setSectionForm({ ...sectionForm, sec_id: e.target.value })}
                required
                disabled={editingSection}
              />
            </div>
            <div className="form-group">
              <label className="form-label required">Course</label>
              <select
                className="form-select"
                value={sectionForm.course_id}
                onChange={(e) => setSectionForm({ ...sectionForm, course_id: e.target.value })}
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_id} - {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label required">Semester</label>
              <select
                className="form-select"
                value={sectionForm.semester}
                onChange={(e) => setSectionForm({ ...sectionForm, semester: e.target.value })}
                required
              >
                <option value="">Select Semester</option>
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label required">Year</label>
              <input
                type="number"
                className="form-input"
                value={sectionForm.year}
                onChange={(e) => setSectionForm({ ...sectionForm, year: e.target.value })}
                required
                min="2020"
                max="2030"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label required">Instructor</label>
            <select
              className="form-select"
              value={sectionForm.instructor_id}
              onChange={(e) => setSectionForm({ ...sectionForm, instructor_id: e.target.value })}
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
            <label className="form-label required">Classroom</label>
            <select
              className="form-select"
              value={`${sectionForm.building}-${sectionForm.room_number}`}
              onChange={(e) => {
                const [building, room_number] = e.target.value.split('-');
                setSectionForm({ ...sectionForm, building, room_number });
              }}
              required
            >
              <option value="">Select Classroom</option>
              {classrooms.map((classroom) => (
                <option 
                  key={`${classroom.building}-${classroom.room_number}`} 
                  value={`${classroom.building}-${classroom.room_number}`}
                >
                  {classroom.building} {classroom.room_number} (Capacity: {classroom.capacity})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required">Time Slot</label>
            <select
              className="form-select"
              value={sectionForm.time_slot_id}
              onChange={(e) => setSectionForm({ ...sectionForm, time_slot_id: e.target.value })}
              required
            >
              <option value="">Select Time Slot</option>
              {timeSlots.map((slot) => (
                <option key={slot.time_slot_id} value={slot.time_slot_id}>
                  {slot.time_slot_id} - {slot.day} {slot.start_time} to {slot.end_time}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CoursePage;