import express from 'express';
import pool from '../db/db.js';
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    // Alias room_no as room_number
    const { rows } = await pool.query(
      'SELECT room_no as room_number, building, capacity FROM Classroom'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { building, room_number, capacity } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO Classroom (room_no, building, capacity) VALUES ($1, $2, $3) RETURNING *',
      [room_number, building, capacity]
    );
    res.status(201).json({...rows[0], room_number: rows[0].room_no});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:building/:roomNumber', async (req, res) => {
  const { building, roomNumber } = req.params;
  const { capacity } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE Classroom SET capacity = $1 WHERE room_no = $2 AND building = $3 RETURNING *',
      [capacity, roomNumber, building]
    );
    res.json({...rows[0], room_number: rows[0].room_no});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:building/:roomNumber', async (req, res) => {
  const { building, roomNumber } = req.params;
  try {
    await pool.query('DELETE FROM Classroom WHERE room_no = $1 AND building = $2', [roomNumber, building]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;