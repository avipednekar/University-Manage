import express from 'express';
import pool from '../db/db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Alias columns for frontend
    const { rows } = await pool.query(
      'SELECT CourseID as course_id, CourseName as title, Duration as credits FROM Courses'
      // Aliasing Duration as credits so the frontend shows *something*
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  // Map frontend fields to schema
  const { course_id, title } = req.body;
  // `dept_name` and `credits` are ignored. `Duration` set to null.
  try {
    const { rows } = await pool.query(
      'INSERT INTO Courses (CourseID, CourseName, Duration) VALUES ($1, $2, NULL) RETURNING *',
      [course_id, title]
    );
    res.status(201).json({...rows[0], course_id: rows[0].courseid, title: rows[0].coursename});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params; // This is CourseID
  const { title } = req.body;
  // `dept_name` and `credits` are ignored.
  try {
    const { rows } = await pool.query(
      'UPDATE Courses SET CourseName = $1 WHERE CourseID = $2 RETURNING *',
      [title, id]
    );
    res.json({...rows[0], course_id: rows[0].courseid, title: rows[0].coursename});
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