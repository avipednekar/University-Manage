import express from 'express';
import pool from '../db/db.js';
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    // Create a "synthetic" room_id for the frontend to use, and alias fields.
    // The frontend's StudentPage also needs `room_id`, so we must provide it.
    const { rows } = await pool.query(
      `SELECT hostel_id, room_number, room_type, floor_number, 
              (hostel_id || '-' || room_number) as room_id 
       FROM Hostel_Room`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  // `capacity` from frontend is ignored. `floor_number` is set to null.
  const { room_number, hostel_id, room_type } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO Hostel_Room (hostel_id, room_number, room_type, floor_number) VALUES ($1, $2, $3, NULL) RETURNING *',
      [hostel_id, room_number, room_type]
    );
    // Return a synthetic room_id
    res.status(201).json({...rows[0], room_id: `${rows[0].hostel_id}-${rows[0].room_number}`});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  // The 'id' here is the synthetic 'hostel_id-room_number'
  const { id } = req.params;
  const { room_number, hostel_id, room_type } = req.body;
  try {
    const [orig_hostel_id, orig_room_number] = id.split('-');
    
    const { rows } = await pool.query(
      `UPDATE Hostel_Room SET hostel_id = $1, room_number = $2, room_type = $3 
       WHERE hostel_id = $4 AND room_number = $5 RETURNING *`,
      [hostel_id, room_number, room_type, orig_hostel_id, orig_room_number]
    );
    res.json({...rows[0], room_id: `${rows[0].hostel_id}-${rows[0].room_number}`});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  // The 'id' here is the synthetic 'hostel_id-room_number'
  const { id } = req.params;
  try {
    const [hostel_id, room_number] = id.split('-');
    await pool.query('DELETE FROM Hostel_Room WHERE hostel_id = $1 AND room_number = $2', [hostel_id, room_number]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;