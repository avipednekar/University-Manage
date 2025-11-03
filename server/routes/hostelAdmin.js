import express from 'express';
import pool from '../db/db.js';
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM Hostel_Admin');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { instructor_id, hostel_id } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO Hostel_Admin (instructor_id, hostel_id) VALUES ($1, $2) RETURNING *',
      [instructor_id, hostel_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Frontend API sends two params, but new Schema PK is only instructor_id
// We will follow the frontend API structure for the DELETE endpoint
router.delete('/:instructorId/:hostelId', async (req, res) => {
  const { instructorId, hostelId } = req.params;
  try {
    // Delete based on instructor_id, as it's the PK in the new schema
    await pool.query(
      'DELETE FROM Hostel_Admin WHERE instructor_id = $1 AND hostel_id = $2',
      [instructorId, hostelId] // This may fail if (instructor_id, hostel_id) is not unique, but PK is only instructor_id
    );
    // A better delete given the new schema:
    // await pool.query('DELETE FROM Hostel_Admin WHERE instructor_id = $1', [instructorId]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;