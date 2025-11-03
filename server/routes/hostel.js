import express from 'express';
import pool from '../db/db.js'; // Make sure this path is correct
const router = express.Router();

// GET all hostels
router.get('/', async (req, res) => {
  try {
    // Select all raw fields + the aliased fields for frontend compatibility
    const { rows } = await pool.query(
      `SELECT 
         hostel_id, 
         hostel_name, 
         address, 
         city, 
         state, 
         pincode, 
         NumberOfSeats,
         (address || ', ' || city || ', ' || state || ' - ' || pincode) as location, 
         NumberOfSeats as capacity 
       FROM Hostel`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new hostel
router.post('/', async (req, res) => {
  // Expect all fields from the new frontend form
  const { hostel_id, hostel_name, address, city, state, pincode, NumberOfSeats } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO Hostel (hostel_id, hostel_name, address, city, state, pincode, NumberOfSeats) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [hostel_id, hostel_name, address, city, state, pincode, NumberOfSeats]
    );
    // Return aliased data for consistency
    const row = rows[0];
    res.status(201).json({
        ...row,
        location: (row.address || ''),
        capacity: row.numberofseats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a hostel
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  // Expect all fields from the new frontend form
  const { hostel_name, address, city, state, pincode, NumberOfSeats } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE Hostel 
       SET hostel_name = $1, address = $2, city = $3, state = $4, pincode = $5, NumberOfSeats = $6 
       WHERE hostel_id = $7 
       RETURNING *`,
      [hostel_name, address, city, state, pincode, NumberOfSeats, id]
    );
    // Return aliased data
    const row = rows[0];
    res.json({
        ...row,
        location: (row.address || ''),
        capacity: row.numberofseats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a hostel (no change needed)
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