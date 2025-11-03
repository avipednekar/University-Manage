import express from 'express';
import pool from '../db/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM Department');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { dept_name, building, budget } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO Department (dept_name, building, budget) VALUES ($1, $2, $3) RETURNING *',
      [dept_name, building, budget]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { building, budget } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE Department SET building = $1, budget = $2 WHERE dept_name = $3 RETURNING *',
      [building, budget, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Department WHERE dept_name = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;