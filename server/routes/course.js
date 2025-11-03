import express from 'express';
import pool from '../db/db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Alias columns for frontend
    // Frontend expects 'course.duration', so we send 'duration'
    const { rows } = await pool.query(
      'SELECT CourseID as course_id, CourseName as title, Duration as duration FROM Courses'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  // Map frontend fields to schema
  // We now correctly read 'duration' from the request body
  const { course_id, title, duration } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO Courses (CourseID, CourseName, Duration) VALUES ($1, $2, $3) RETURNING *',
      [course_id, title, duration || null] // Save the duration
    );
    res.status(201).json({
      ...rows[0], 
      course_id: rows[0].courseid, 
      title: rows[0].coursename, 
      duration: rows[0].duration 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params; // This is CourseID
  // We now correctly read 'duration' from the request body
  const { title, duration } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE Courses SET CourseName = $1, Duration = $2 WHERE CourseID = $3 RETURNING *',
      [title, duration || null, id] // Update the duration
    );
    res.json({
      ...rows[0], 
      course_id: rows[0].courseid, 
      title: rows[0].coursename, 
      duration: rows[0].duration 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Courses WHERE CourseID = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;