import express from 'express';
import pool from '../db/db.js';
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    // Alias columns for frontend
    const { rows } = await pool.query(
      'SELECT Exam_code as exam_id, Student_ID as student_id FROM Exam_student'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  // `marks` from frontend is ignored.
  const { student_id, exam_id } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO Exam_student (Student_ID, Exam_code) VALUES ($1, $2) RETURNING *',
      [student_id, exam_id]
    );
    res.status(201).json({...rows[0], exam_id: rows[0].exam_code, student_id: rows[0].student_id});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:examId/:studentId', async (req, res) => {
  const { examId, studentId } = req.params;
  try {
    await pool.query(
      'DELETE FROM Exam_student WHERE Exam_code = $1 AND Student_ID = $2',
      [examId, studentId]
    );
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;