import React, { useState, useEffect } from 'react';
import { enrollmentAPI, examStudentAPI, studentAPI, courseAPI, sectionAPI, examAPI } from '../api/api';
import Modal from '../components/Common/Modal';
import { FaPlus, FaTrash, FaClipboardList, FaFileAlt } from 'react-icons/fa';

const EnrollmentPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [examStudents, setExamStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showExamStudentModal, setShowExamStudentModal] = useState(false);
  const [enrollmentForm, setEnrollmentForm] = useState({
    student_id: '', course_id: '', sec_id: '', semester: '', year: '', grade: ''
  });
  const [examStudentForm, setExamStudentForm] = useState({ student_id: '', exam_id: '', marks: '' });
  const [activeTab, setActiveTab] = useState('enrollments');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enr, exs, stu, cou, sec, exa] = await Promise.all([
        enrollmentAPI.getAll(),
        examStudentAPI.getAll(),
        studentAPI.getAll(),
        courseAPI.getAll(),
        sectionAPI.getAll(),
        examAPI.getAll()
      ]);
      setEnrollments(enr.data);
      setExamStudents(exs.data);
      setStudents(stu.data);
      setCourses(cou.data);
      setSections(sec.data);
      setExams(exa.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await enrollmentAPI.create(enrollmentForm);
      fetchData();
      setShowEnrollmentModal(false);
      setEnrollmentForm({ student_id: '', course_id: '', sec_id: '', semester: '', year: '', grade: '' });
    } catch (error) {
      alert('Failed to create enrollment');
    }
  };

  const handleExamStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      await examStudentAPI.create(examStudentForm);
      fetchData();
      setShowExamStudentModal(false);
      setExamStudentForm({ student_id: '', exam_id: '', marks: '' });
    } catch (error) {
      alert('Failed to assign student to exam');
    }
  };

  const handleDeleteEnrollment = async (id) => {
    if (window.confirm('Delete this enrollment?')) {
      try {
        await enrollmentAPI.delete(id);
        fetchData();
      } catch (error) {
        alert('Failed to delete enrollment');
      }
    }
  };

  const handleDeleteExamStudent = async (examId, studentId) => {
    if (window.confirm('Remove this student from exam?')) {
      try {
        await examStudentAPI.delete(examId, studentId);
        fetchData();
      } catch (error) {
        alert('Failed to remove student from exam');
      }
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Enrollment & Exam Management</h1>
        <p className="page-description">Manage course enrollments and exam registrations</p>
      </div>

      <div style={{ marginBottom: '20px', borderBottom: '2px solid #e2e8f0' }}>
        <button onClick={() => setActiveTab('enrollments')} style={{
          padding: '12px 24px', border: 'none',
          background: activeTab === 'enrollments' ? '#2563eb' : 'transparent',
          color: activeTab === 'enrollments' ? 'white' : '#64748b',
          fontWeight: '600', cursor: 'pointer', borderRadius: '6px 6px 0 0', marginRight: '8px'
        }}>
          <FaClipboardList style={{ marginRight: '8px' }} />Course Enrollments
        </button>
        <button onClick={() => setActiveTab('examstudents')} style={{
          padding: '12px 24px', border: 'none',
          background: activeTab === 'examstudents' ? '#2563eb' : 'transparent',
          color: activeTab === 'examstudents' ? 'white' : '#64748b',
          fontWeight: '600', cursor: 'pointer', borderRadius: '6px 6px 0 0'
        }}>
          <FaFileAlt style={{ marginRight: '8px' }} />Exam Registrations
        </button>
      </div>

      {activeTab === 'enrollments' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Course Enrollments</h2>
            <button className="btn btn-primary" onClick={() => setShowEnrollmentModal(true)}>
              <FaPlus /> Add Enrollment
            </button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Section</th>
                  <th>Semester</th>
                  <th>Year</th>
                  <th>Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    No enrollments found. Add your first enrollment!
                  </td></tr>
                ) : (
                  enrollments.map((enr, idx) => (
                    <tr key={idx}>
                      <td>{students.find(s => s.student_id === enr.student_id)?.name || enr.student_id}</td>
                      <td>{courses.find(c => c.course_id === enr.course_id)?.title || enr.course_id}</td>
                      <td><span className="badge badge-primary">{enr.sec_id}</span></td>
                      <td><span className="badge badge-success">{enr.semester}</span></td>
                      <td>{enr.year}</td>
                      <td>{enr.grade ? <span className="badge badge-warning">{enr.grade}</span> : '-'}</td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteEnrollment(enr.enrollment_id || idx)}>
                          <FaTrash />
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

      {activeTab === 'examstudents' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Exam Registrations</h2>
            <button className="btn btn-primary" onClick={() => setShowExamStudentModal(true)}>
              <FaPlus /> Register Student for Exam
            </button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Exam</th>
                  <th>Marks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {examStudents.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                    No exam registrations found. Register students for exams!
                  </td></tr>
                ) : (
                  examStudents.map((es, idx) => (
                    <tr key={idx}>
                      <td>{students.find(s => s.student_id === es.student_id)?.name || es.student_id}</td>
                      <td>{exams.find(e => e.exam_id === es.exam_id)?.exam_name || es.exam_id}</td>
                      <td>{es.marks !== null && es.marks !== undefined ? <span className="badge badge-success">{es.marks}</span> : '-'}</td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteExamStudent(es.exam_id, es.student_id)}>
                          <FaTrash />
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

      {/* Enrollment Modal */}
      <Modal
        isOpen={showEnrollmentModal}
        onClose={() => {
          setShowEnrollmentModal(false);
          setEnrollmentForm({ student_id: '', course_id: '', sec_id: '', semester: '', year: '', grade: '' });
        }}
        title="Add New Enrollment"
        footer={
          <>
            <button className="btn" onClick={() => setShowEnrollmentModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleEnrollmentSubmit}>Enroll</button>
          </>
        }
      >
        <form onSubmit={handleEnrollmentSubmit}>
          <div className="form-group">
            <label className="form-label required">Student</label>
            <select className="form-select" value={enrollmentForm.student_id}
              onChange={(e) => setEnrollmentForm({ ...enrollmentForm, student_id: e.target.value })} required>
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.student_id} value={s.student_id}>
                  {s.student_id} - {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required">Course</label>
            <select className="form-select" value={enrollmentForm.course_id}
              onChange={(e) => setEnrollmentForm({ ...enrollmentForm, course_id: e.target.value })} required>
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.course_id} value={c.course_id}>
                  {c.course_id} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required">Section</label>
            <select className="form-select" value={enrollmentForm.sec_id}
              onChange={(e) => setEnrollmentForm({ ...enrollmentForm, sec_id: e.target.value })} required>
              <option value="">Select Section</option>
              {sections.filter(sec => sec.course_id === enrollmentForm.course_id).map((sec) => (
                <option key={sec.sec_id} value={sec.sec_id}>
                  {sec.sec_id} - {sec.semester} {sec.year}
                </option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label required">Semester</label>
              <select className="form-select" value={enrollmentForm.semester}
                onChange={(e) => setEnrollmentForm({ ...enrollmentForm, semester: e.target.value })} required>
                <option value="">Select Semester</option>
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label required">Year</label>
              <input type="number" className="form-input" value={enrollmentForm.year}
                onChange={(e) => setEnrollmentForm({ ...enrollmentForm, year: e.target.value })}
                required min="2020" max="2030" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Grade (Optional)</label>
            <select className="form-select" value={enrollmentForm.grade}
              onChange={(e) => setEnrollmentForm({ ...enrollmentForm, grade: e.target.value })}>
              <option value="">Not Graded Yet</option>
              <option value="A+">A+</option>
              <option value="A">A</option>
              <option value="B+">B+</option>
              <option value="B">B</option>
              <option value="C+">C+</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Exam Student Modal */}
      <Modal
        isOpen={showExamStudentModal}
        onClose={() => {
          setShowExamStudentModal(false);
          setExamStudentForm({ student_id: '', exam_id: '', marks: '' });
        }}
        title="Register Student for Exam"
        footer={
          <>
            <button className="btn" onClick={() => setShowExamStudentModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleExamStudentSubmit}>Register</button>
          </>
        }
      >
        <form onSubmit={handleExamStudentSubmit}>
          <div className="form-group">
            <label className="form-label required">Student</label>
            <select className="form-select" value={examStudentForm.student_id}
              onChange={(e) => setExamStudentForm({ ...examStudentForm, student_id: e.target.value })} required>
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.student_id} value={s.student_id}>
                  {s.student_id} - {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label required">Exam</label>
            <select className="form-select" value={examStudentForm.exam_id}
              onChange={(e) => setExamStudentForm({ ...examStudentForm, exam_id: e.target.value })} required>
              <option value="">Select Exam</option>
              {exams.map((e) => (
                <option key={e.exam_id} value={e.exam_id}>
                  {e.exam_id} - {e.exam_name} ({e.exam_date})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Marks (Optional)</label>
            <input type="number" className="form-input" value={examStudentForm.marks}
              onChange={(e) => setExamStudentForm({ ...examStudentForm, marks: e.target.value })}
              min="0" max="100" placeholder="Leave empty if not graded yet" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EnrollmentPage;