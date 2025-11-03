import express from 'express';
import pool from '../db/db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Alias room_no to room_number
    const { rows } = await pool.query(
      'SELECT course_id, sec_id, semester, year, instructor_id, time_slot_id, building, room_no as room_number FROM section'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { sec_id, course_id, semester, year, building, room_number, time_slot_id, instructor_id } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO section (course_id, sec_id, semester, year, instructor_id, time_slot_id, building, room_no) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [course_id, sec_id, semester, year, instructor_id, time_slot_id, building, room_number]
    );
    res.status(201).json({...rows[0], room_number: rows[0].room_no});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- THIS ROUTE IS NOW FIXED ---
router.put('/:id', async (req, res) => {
  // Frontend uses `sec_id` as the :id
  const { id } = req.params; 
  const { course_id, semester, year, building, room_number, time_slot_id, instructor_id } = req.body;
  try {
    // The UPDATE query is now corrected.
    // It updates ALL fields, including course_id.
    // It ONLY uses sec_id (from the 'id' param) in the WHERE clause.
    const { rows } = await pool.query(
      `UPDATE section SET 
         course_id = $1, 
         semester = $2, 
         year = $3, 
         instructor_id = $4, 
         time_slot_id = $5, 
         building = $6, 
         room_no = $7 
       WHERE 
         sec_id = $8 
       RETURNING *`,
      [course_id, semester, year, instructor_id, time_slot_id, building, room_number, id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Section not found.' });
    }
    
    res.json({...rows[0], room_number: rows[0].room_no});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  // Frontend uses `sec_id` as the :id.
  // This assumes sec_id is unique, matching the logic of the PUT route.
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM section WHERE sec_id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;