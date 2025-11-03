import express from 'express';
import pool from '../db/db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Alias columns to match frontend
    const { rows } = await pool.query(
      `SELECT student_ID as student_id, 
              (first_name || ' ' || last_name) as name, 
              dept_name, 
              HostelID as hostel_id, 
              room_number as room_id 
       FROM Student`
      // We are not selecting tot_cred as it doesn't exist
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  // Map frontend fields to schema
  const { student_id, name, dept_name, hostel_id, room_id } = req.body;
  // `tot_cred` is ignored.
  try {
    // We assume `name` maps to `first_name` and `room_id` maps to `room_number`
    const { rows } = await pool.query(
      `INSERT INTO Student (student_ID, first_name, dept_name, HostelID, room_number) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [student_id, name, dept_name, hostel_id || null, room_id || null]
    );
    res.status(201).json({...rows[0], student_id: rows[0].student_id, name: rows[0].first_name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params; // This is student_ID
  const { name, dept_name, hostel_id, room_id } = req.body;
  // `tot_cred` is ignored.
  try {
    // Assume `name` maps to `first_name` and `room_id` maps to `room_number`
    const { rows } = await pool.query(
      `UPDATE Student SET first_name = $1, dept_name = $2, HostelID = $3, room_number = $4 
       WHERE student_ID = $5 RETURNING *`,
      [name, dept_name, hostel_id || null, room_id || null, id]
    );
    res.json({...rows[0], student_id: rows[0].student_id, name: rows[0].first_name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Student WHERE student_ID = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;