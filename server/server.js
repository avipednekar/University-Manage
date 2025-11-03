import express from 'express';
import cors from 'cors';

// Import all routers
import departmentRoutes from './routes/department.js';
import hostelRoutes from './routes/hostel.js';
import roomRoutes from './routes/room.js';
import instructorRoutes from './routes/instructor.js';
import hostelAdminRoutes from './routes/hostelAdmin.js';
import studentRoutes from './routes/student.js';
import courseRoutes from './routes/course.js';
import sectionRoutes from './routes/section.js';
import classroomRoutes from './routes/classroom.js';
import timeSlotRoutes from './routes/timeslot.js';
import examRoutes from './routes/exam.js';
import enrollmentRoutes from './routes/enrollment.js';
import examStudentRoutes from './routes/examStudent.js';
import statsRoutes from './routes/stats.js';

const app = express();
const PORT = 5000; 

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// API Routes
app.get('/', (req, res) => {
  res.send('University Management API is running...');
});

app.use('/api/departments', departmentRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/hostel-admins', hostelAdminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/timeslots', timeSlotRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/exam-students', examStudentRoutes);
app.use('/api/stats', statsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});