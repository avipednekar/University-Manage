import express from 'express';
import pool from '../db/db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Alias columns to match frontend expectations
    const { rows } = await pool.query(
      `SELECT hostel_id, hostel_name, 
              (address || ', ' || city || ', ' || state || ' - ' || pincode) as location, 
              NumberOfSeats as capacity 
       FROM Hostel`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  // Map frontend fields to schema
  const { hostel_name, location, capacity } = req.body;
  try {
    // We assume 'location' maps to 'address' and 'capacity' to 'NumberOfSeats'.
    // Other address fields are set to NULL.
    const { rows } = await pool.query(
      'INSERT INTO Hostel (hostel_id, hostel_name, address, capacity) VALUES (DEFAULT, $1, $2, $3) RETURNING *',
      [hostel_name, location, capacity]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { hostel_name, location, capacity } = req.body;
  try {
    // Map fields for update
    const { rows } = await pool.query(
      'UPDATE Hostel SET hostel_name = $1, address = $2, NumberOfSeats = $3 WHERE hostel_id = $4 RETURNING *',
      [hostel_name, location, capacity, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Hostel WHERE hostel_id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;