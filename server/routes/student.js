import express from 'express';
import pool from '../db/db.js'; 
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
         student_ID as student_id, 
         first_name, 
         last_name, 
         phone_num,
         DOB,
         dept_name, 
         HostelID as hostel_id, 
         room_number,
         (HostelID || '-' || room_number) as room_id 
       FROM Student`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  // Map frontend fields to schema
  const { student_id, first_name, last_name, dept_name, hostel_id, room_id, phone_num, DOB } = req.body;
  
  // Deconstruct synthetic room_id from frontend (e.g., "1-101")
  // The student table stores the room_number ("101"), not the synthetic ID.
  let room_number = null;
  if (room_id) {
    room_number = room_id.split('-')[1] || null;
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO Student (student_ID, first_name, last_name, phone_num, DOB, dept_name, HostelID, room_number) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [student_id, first_name, last_name, phone_num || null, DOB || null, dept_name, hostel_id || null, room_number]
    );
    // Return aliased data
    res.status(201).json({
        ...rows[0], 
        student_id: rows[0].student_id, 
        hostel_id: rows[0].hostelid, 
        room_id: room_id // Send back the synthetic key
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params; // This is student_ID
  const { first_name, last_name, dept_name, hostel_id, room_id, phone_num, DOB } = req.body;
  
  // Deconstruct synthetic room_id from frontend
  let room_number = null;
  if (room_id) {
    room_number = room_id.split('-')[1] || null;
  }

  try {
    const { rows } = await pool.query(
      `UPDATE Student SET 
         first_name = $1, 
         last_name = $2, 
         phone_num = $3, 
         DOB = $4, 
         dept_name = $5, 
         HostelID = $6, 
         room_number = $7 
       WHERE student_ID = $8 RETURNING *`,
      [first_name, last_name, phone_num || null, DOB || null, dept_name, hostel_id || null, room_number, id]
    );
    res.json({
        ...rows[0], 
        student_id: rows[0].student_id, 
        hostel_id: rows[0].hostelid,
        room_id: room_id // Send back the synthetic key
    });
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