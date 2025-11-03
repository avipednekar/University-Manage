import express from 'express';
import pool from '../db/db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Create a "synthetic" enrollment_id for the frontend to use
    const { rows } = await pool.query(
      `SELECT student_ID as student_id, course_id, sec_id, semester, year, grade,
              (student_ID || '-' || course_id || '-' || sec_id || '-' || semester || '-' || year) as enrollment_id 
       FROM Takes`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { student_id, course_id, sec_id, semester, year, grade } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO Takes (student_ID, course_id, sec_id, semester, year, grade) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [student_id, course_id, sec_id, semester, year, grade || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  // The 'id' here is the synthetic key: 'student_ID-course_id-sec_id-semester-year'
  const { id } = req.params;
  try {
    const [student_ID, course_id, sec_id, semester, year] = id.split('-');
    
    await pool.query(
      `DELETE FROM Takes 
       WHERE student_ID = $1 AND course_id = $2 AND sec_id = $3 AND semester = $4 AND year = $5`,
      [student_ID, course_id, sec_id, semester, year]
    );
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;