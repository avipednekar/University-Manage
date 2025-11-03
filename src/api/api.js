import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const departmentAPI = {
  getAll: () => api.get('/departments'),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`)
};

export const hostelAPI = {
  getAll: () => api.get('/hostels'),
  create: (data) => api.post('/hostels', data),
  update: (id, data) => api.put(`/hostels/${id}`, data),
  delete: (id) => api.delete(`/hostels/${id}`)
};

export const roomAPI = {
  getAll: () => api.get('/rooms'),
  getByHostel: (hostelId) => api.get(`/rooms/hostel/${hostelId}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`)
};

export const instructorAPI = {
  getAll: () => api.get('/instructors'),
  create: (data) => api.post('/instructors', data),
  update: (id, data) => api.put(`/instructors/${id}`, data),
  delete: (id) => api.delete(`/instructors/${id}`)
};

export const hostelAdminAPI = {
  getAll: () => api.get('/hostel-admins'),
  create: (data) => api.post('/hostel-admins', data),
  delete: (instructorId, hostelId) => api.delete(`/hostel-admins/${instructorId}/${hostelId}`)
};

export const studentAPI = {
  getAll: () => api.get('/students'),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`)
};

export const courseAPI = {
  getAll: () => api.get('/courses'),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`)
};

export const sectionAPI = {
  getAll: () => api.get('/sections'),
  create: (data) => api.post('/sections', data),
  update: (id, data) => api.put(`/sections/${id}`, data),
  delete: (id) => api.delete(`/sections/${id}`)
};

export const classroomAPI = {
  getAll: () => api.get('/classrooms'),
  create: (data) => api.post('/classrooms', data),
  update: (building, roomNumber, data) => api.put(`/classrooms/${building}/${roomNumber}`, data),
  delete: (building, roomNumber) => api.delete(`/classrooms/${building}/${roomNumber}`)
};

export const timeSlotAPI = {
  getAll: () => api.get('/timeslots'),
  create: (data) => api.post('/timeslots', data),
  update: (id, data) => api.put(`/timeslots/${id}`, data),
  delete: (id) => api.delete(`/timeslots/${id}`)
};

export const examAPI = {
  getAll: () => api.get('/exams'),
  create: (data) => api.post('/exams', data),
  update: (id, data) => api.put(`/exams/${id}`, data),
  delete: (id) => api.delete(`/exams/${id}`)
};

export const enrollmentAPI = {
  getAll: () => api.get('/enrollments'),
  create: (data) => api.post('/enrollments', data),
  delete: (id) => api.delete(`/enrollments/${id}`)
};

export const examStudentAPI = {
  getAll: () => api.get('/exam-students'),
  create: (data) => api.post('/exam-students', data),
  delete: (examId, studentId) => api.delete(`/exam-students/${examId}/${studentId}`)
};

export const statsAPI = {
  getStats: () => api.get('/stats')
};

export default api;