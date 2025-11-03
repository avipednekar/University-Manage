import express from 'express';
import pool from '../db/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Run all count queries in parallel
    const [
      deptCount, 
      hostelCount, 
      instructorCount, 
      studentCount, 
      courseCount, 
      classroomCount
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM Department'),
      pool.query('SELECT COUNT(*) FROM Hostel'),
      pool.query('SELECT COUNT(*) FROM Instructor'),
      pool.query('SELECT COUNT(*) FROM Student'),
      pool.query('SELECT COUNT(*) FROM Courses'),
      pool.query('SELECT COUNT(*) FROM Classroom')
    ]);

    // Send all counts as a single JSON object
    res.json({
      departments: parseInt(deptCount.rows[0].count, 10),
      hostels: parseInt(hostelCount.rows[0].count, 10),
      instructors: parseInt(instructorCount.rows[0].count, 10),
      students: parseInt(studentCount.rows[0].count, 10),
      courses: parseInt(courseCount.rows[0].count, 10),
      classrooms: parseInt(classroomCount.rows[0].count, 10)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;