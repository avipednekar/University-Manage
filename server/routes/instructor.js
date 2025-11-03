import express from 'express';
import pool from '../db/db.js';
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    // Alias ID as instructor_id
    const { rows } = await pool.query(
      'SELECT ID as instructor_id, name, dept_name, salary FROM Instructor'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  // Map frontend instructor_id to ID
  const { instructor_id, name, dept_name, salary } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO Instructor (ID, name, dept_name, salary) VALUES ($1, $2, $3, $4) RETURNING *',
      [instructor_id, name, dept_name, salary]
    );
    res.status(201).json({...rows[0], instructor_id: rows[0].id});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  // :id is instructor_id (which is ID)
  const { id } = req.params;
  const { name, dept_name, salary } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE Instructor SET name = $1, dept_name = $2, salary = $3 WHERE ID = $4 RETURNING *',
      [name, dept_name, salary, id]
    );
    res.json({...rows[0], instructor_id: rows[0].id});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Instructor WHERE ID = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;