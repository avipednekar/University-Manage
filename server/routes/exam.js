import express from 'express';
import pool from '../db/db.js';
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    // Alias columns to match frontend
    const { rows } = await pool.query(
      `SELECT Exam_code as exam_id, 
              Exam_code as exam_name, 
              date as exam_date, 
              room_no as room_number 
       FROM Exam`
       // Aliasing Exam_code as exam_name so frontend doesn't show 'N/A'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  // Map frontend fields to schema
  const { exam_id, exam_date, room_number } = req.body;
  // `exam_name`, `building` are ignored. `time` is set to null.
  try {
    const { rows } = await pool.query(
      'INSERT INTO Exam (Exam_code, date, room_no, time) VALUES ($1, $2, $3, NULL) RETURNING *',
      [exam_id, exam_date, room_number]
    );
    res.status(201).json({...rows[0], exam_id: rows[0].exam_code, exam_date: rows[0].date, room_number: rows[0].room_no});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params; // This is Exam_code
  const { exam_date, room_number } = req.body;
  // `exam_name`, `building` are ignored.
  try {
    const { rows } = await pool.query(
      'UPDATE Exam SET date = $1, room_no = $2 WHERE Exam_code = $3 RETURNING *',
      [exam_date, room_number, id]
    );
    res.json({...rows[0], exam_id: rows[0].exam_code, exam_date: rows[0].date, room_number: rows[0].room_no});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Exam WHERE Exam_code = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;