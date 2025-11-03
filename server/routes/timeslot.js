import express from 'express';
import pool from '../db/db.js';
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM Time_slot');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { time_slot_id, day, start_time, end_time } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO Time_slot (time_slot_id, day, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING *',
      [time_slot_id, day, start_time, end_time]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { day, start_time, end_time } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE Time_slot SET day = $1, start_time = $2, end_time = $3 WHERE time_slot_id = $4 RETURNING *',
      [day, start_time, end_time, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Time_slot WHERE time_slot_id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;