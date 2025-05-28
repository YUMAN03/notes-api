const express = require('express');
const app = express();
const pool = require('./db');
const PORT = 4000;
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

app.use(express.json());

app.post('/notes', async (req, res) => {
  try {
    const id = Date.now();
    const { text } = req.body;
    await pool.query('INSERT INTO notes (id, text) VALUES ($1, $2)', [id, text]);
    res.status(201).json({ id, text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/notes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notes ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/notes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { text } = req.body;
    const result = await pool.query('UPDATE notes SET text = $1 WHERE id = $2 RETURNING *', [text, id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Note not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/notes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await pool.query('DELETE FROM notes WHERE id = $1', [id]);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Notes API!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
